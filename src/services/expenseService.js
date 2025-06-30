// services/expenseService.js
import { supabase } from '../lib/supabase.js'
import { authState } from './authService.js'

export class ExpenseService {
  // Get all expenses for current user
  async getUserExpenses(userId = null) {
    try {
      const targetUserId = userId || authState.user?.id

      const { data, error } = await supabase
        .from('expenses')
        .select(
          `
          *,
          employee:employees(id, name, email, department),
          category:expense_categories(id, name, description),
          reviewer:employees!expenses_reviewed_by_fkey(id, name, email),
          attachments:expense_attachments(*)
        `,
        )
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user expenses:', error)
      return { data: null, error }
    }
  }

  // Get all expenses (for managers/directors)
  async getAllExpenses(filters = {}) {
    try {
      let query = supabase.from('expenses').select(`
          *,
          employee:employees(id, name, email, department),
          category:expense_categories(id, name, description),
          reviewer:employees!expenses_reviewed_by_fkey(id, name, email),
          attachments:expense_attachments(*)
        `)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.department) {
        query = query.eq('employee.department', filters.department)
      }
      if (filters.dateFrom) {
        query = query.gte('expense_date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('expense_date', filters.dateTo)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching all expenses:', error)
      return { data: null, error }
    }
  }

  // Get pending expenses for approval
  async getPendingExpenses() {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(
          `
          *,
          employee:employees(id, name, email, department),
          category:expense_categories(id, name, description),
          attachments:expense_attachments(*)
        `,
        )
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching pending expenses:', error)
      return { data: null, error }
    }
  }

  // Create new expense
  async createExpense(expenseData, files = []) {
    try {
      const userId = authState.user?.id
      if (!userId) throw new Error('User not authenticated')

      // Get employee record
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('auth_user_id', userId)
        .single()

      if (!employee) throw new Error('Employee record not found')

      // Create expense record
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          employee_id: employee.id,
          category_id: expenseData.category_id,
          title: expenseData.title,
          description: expenseData.description,
          amount: expenseData.amount,
          currency: expenseData.currency || 'BRL',
          expense_date: expenseData.expense_date,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (expenseError) throw expenseError

      // Upload files if provided
      if (files && files.length > 0) {
        await this.uploadExpenseFiles(expense.id, files)
      }

      // Send notification to managers
      await this.notifyManagers(expense)

      return { data: expense, error: null }
    } catch (error) {
      console.error('Error creating expense:', error)
      return { data: null, error }
    }
  }

  // Update expense
  async updateExpense(expenseId, expenseData, newFiles = []) {
    try {
      const { data: expense, error } = await supabase
        .from('expenses')
        .update({
          category_id: expenseData.category_id,
          title: expenseData.title,
          description: expenseData.description,
          amount: expenseData.amount,
          expense_date: expenseData.expense_date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', expenseId)
        .select()
        .single()

      if (error) throw error

      // Upload new files if provided
      if (newFiles && newFiles.length > 0) {
        await this.uploadExpenseFiles(expenseId, newFiles)
      }

      return { data: expense, error: null }
    } catch (error) {
      console.error('Error updating expense:', error)
      return { data: null, error }
    }
  }

  // Delete expense
  async deleteExpense(expenseId) {
    try {
      // Delete associated files first
      await this.deleteExpenseFiles(expenseId)

      // Delete expense record
      const { error } = await supabase.from('expenses').delete().eq('id', expenseId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting expense:', error)
      return { error }
    }
  }

  // Approve/Reject expense
  async updateExpenseStatus(expenseId, status, comments = '') {
    try {
      const userId = authState.user?.id
      if (!userId) throw new Error('User not authenticated')

      // Get reviewer employee record
      const { data: reviewer } = await supabase
        .from('employees')
        .select('id')
        .eq('auth_user_id', userId)
        .single()

      if (!reviewer) throw new Error('Reviewer record not found')

      const { data: expense, error } = await supabase
        .from('expenses')
        .update({
          status,
          reviewed_by: reviewer.id,
          reviewed_at: new Date().toISOString(),
          review_comments: comments,
        })
        .eq('id', expenseId)
        .select(
          `
          *,
          employee:employees(id, name, email, auth_user_id)
        `,
        )
        .single()

      if (error) throw error

      // Notify employee about status change
      await this.notifyEmployee(expense, status)

      return { data: expense, error: null }
    } catch (error) {
      console.error('Error updating expense status:', error)
      return { data: null, error }
    }
  }

  // Upload files for expense
  async uploadExpenseFiles(expenseId, files) {
    try {
      const userId = authState.user?.id
      const uploadPromises = files.map(async (file) => {
        const fileName = `${userId}/${expenseId}/${Date.now()}_${file.name}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('expense-receipts')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('expense-receipts').getPublicUrl(fileName)

        // Save attachment record
        const { error: attachmentError } = await supabase.from('expense_attachments').insert({
          expense_id: expenseId,
          filename: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
        })

        if (attachmentError) throw attachmentError

        return uploadData
      })

      await Promise.all(uploadPromises)
      return { error: null }
    } catch (error) {
      console.error('Error uploading expense files:', error)
      return { error }
    }
  }

  // Delete expense files
  async deleteExpenseFiles(expenseId) {
    try {
      // Get file paths
      const { data: attachments } = await supabase
        .from('expense_attachments')
        .select('file_url')
        .eq('expense_id', expenseId)

      if (attachments && attachments.length > 0) {
        // Extract file paths from URLs
        const filePaths = attachments.map((att) => {
          const url = new URL(att.file_url)
          return url.pathname.split('/').slice(-3).join('/')
        })

        // Delete from storage
        await supabase.storage.from('expense-receipts').remove(filePaths)
      }

      // Delete attachment records
      await supabase.from('expense_attachments').delete().eq('expense_id', expenseId)

      return { error: null }
    } catch (error) {
      console.error('Error deleting expense files:', error)
      return { error }
    }
  }

  // Get expense categories
  async getExpenseCategories() {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching expense categories:', error)
      return { data: null, error }
    }
  }

  // Get expense statistics
  async getExpenseStats(userId = null) {
    try {
      const targetUserId = userId || authState.user?.id

      const { data, error } = await supabase.rpc('get_user_expense_stats', {
        user_uuid: targetUserId,
      })

      if (error) throw error
      return { data: data[0] || {}, error: null }
    } catch (error) {
      console.error('Error fetching expense stats:', error)
      return { data: null, error }
    }
  }

  // Notify managers about new expense
  async notifyManagers(expense) {
    try {
      // Get all managers
      const { data: managers } = await supabase
        .from('employees')
        .select('auth_user_id')
        .in('role', ['manager', 'director', 'admin'])

      if (managers && managers.length > 0) {
        const notifications = managers.map((manager) => ({
          user_id: manager.auth_user_id,
          title: 'Nova Despesa Submetida',
          message: `${expense.title} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}`,
          type: 'expense_submitted',
          related_expense_id: expense.id,
        }))

        await supabase.from('notifications').insert(notifications)
      }
    } catch (error) {
      console.error('Error notifying managers:', error)
    }
  }

  // Notify employee about status change
  async notifyEmployee(expense, status) {
    try {
      const statusMessages = {
        approved: 'Sua despesa foi aprovada!',
        rejected: 'Sua despesa foi rejeitada.',
      }

      await supabase.from('notifications').insert({
        user_id: expense.employee.auth_user_id,
        title: `Despesa ${status === 'approved' ? 'Aprovada' : 'Rejeitada'}`,
        message: `${expense.title} - ${statusMessages[status]}`,
        type: `expense_${status}`,
        related_expense_id: expense.id,
      })
    } catch (error) {
      console.error('Error notifying employee:', error)
    }
  }

  // Export expenses to CSV
  async exportExpenses(filters = {}) {
    try {
      const { data: expenses, error } = await this.getAllExpenses(filters)

      if (error) throw error

      // Convert to CSV format
      const csvData = expenses.map((expense) => ({
        Data: new Date(expense.expense_date).toLocaleDateString('pt-BR'),
        Funcionário: expense.employee.name,
        Departamento: expense.employee.department,
        Categoria: expense.category.name,
        Título: expense.title,
        Descrição: expense.description,
        Valor: expense.amount,
        Status: expense.status,
        'Data Submissão': new Date(expense.submitted_at).toLocaleDateString('pt-BR'),
        Revisor: expense.reviewer?.name || '',
        'Data Revisão': expense.reviewed_at
          ? new Date(expense.reviewed_at).toLocaleDateString('pt-BR')
          : '',
      }))

      return { data: csvData, error: null }
    } catch (error) {
      console.error('Error exporting expenses:', error)
      return { data: null, error }
    }
  }
}

// Create singleton instance
export const expenseService = new ExpenseService()

// Vue composable for expenses
export function useExpenses() {
  return {
    getUserExpenses: expenseService.getUserExpenses.bind(expenseService),
    getAllExpenses: expenseService.getAllExpenses.bind(expenseService),
    getPendingExpenses: expenseService.getPendingExpenses.bind(expenseService),
    createExpense: expenseService.createExpense.bind(expenseService),
    updateExpense: expenseService.updateExpense.bind(expenseService),
    deleteExpense: expenseService.deleteExpense.bind(expenseService),
    updateExpenseStatus: expenseService.updateExpenseStatus.bind(expenseService),
    getExpenseCategories: expenseService.getExpenseCategories.bind(expenseService),
    getExpenseStats: expenseService.getExpenseStats.bind(expenseService),
    exportExpenses: expenseService.exportExpenses.bind(expenseService),
  }
}
