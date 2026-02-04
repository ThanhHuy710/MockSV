import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://69829b249c3efeb892a2bfb9.mockapi.io/api/sinhvien/sinhvien'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ Name: '', Phone: '', Avatar: '' })
  const [editingId, setEditingId] = useState(null)

  // Read - Get all students
  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create - Add new student
  const addStudent = async (e) => {
    e.preventDefault()
    if (!formData.Name || !formData.Phone) {
      alert('Vui lòng điền tên và số điện thoại')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const newStudent = await response.json()
      setStudents([...students, newStudent])
      setFormData({ Name: '', Phone: '', Avatar: '' })
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  // Update - Edit student
  const updateStudent = async (e) => {
    e.preventDefault()
    if (!formData.Name || !formData.Phone) {
      alert('Vui lòng điền tên và số điện thoại')
      return
    }

    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const updatedStudent = await response.json()
      setStudents(students.map(s => s.id === editingId ? updatedStudent : s))
      setFormData({ Name: '', Phone: '', Avatar: '' })
      setEditingId(null)
    } catch (error) {
      console.error('Error updating student:', error)
    }
  }

  // Delete - Remove student
  const deleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setStudents(students.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  // Edit - Prepare form for editing
  const handleEdit = (student) => {
    setFormData({ Name: student.Name, Phone: student.Phone || '', Avatar: student.Avatar || '' })
    setEditingId(student.id)
  }

  // Reset form
  const handleCancel = () => {
    setFormData({ Name: '', Phone: '', Avatar: '' })
    setEditingId(null)
  }

  // Load students on component mount
  useEffect(() => {
    fetchStudents()
  }, [])

  return (
    <div className="app-container">
      <h1>👨‍🎓 Student Management System</h1>

      {/* Form */}
      <div className="form-section">
        <h2>{editingId ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới'}</h2>
        <form onSubmit={editingId ? updateStudent : addStudent}>
          <input
            type="text"
            placeholder="Tên sinh viên"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={formData.Phone}
            onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="URL ảnh đại diện"
            value={formData.Avatar}
            onChange={(e) => setFormData({ ...formData, Avatar: e.target.value })}
          />
          <div className="button-group">
            <button type="submit" className="btn-submit">
              {editingId ? '✏️ Cập nhật' : '➕ Thêm'}
            </button>
            {editingId && (
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                ❌ Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Students List */}
      <div className="list-section">
        <h2>Danh sách sinh viên ({students.length})</h2>
        <button onClick={fetchStudents} className="btn-refresh" disabled={loading}>
          {loading ? '⏳ Đang tải...' : '🔄 Làm mới'}
        </button>

        {students.length === 0 ? (
          <p className="no-data">Không có dữ liệu sinh viên</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên sinh viên</th>
                <th>Số điện thoại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td className="avatar-cell">
                    <img src={student.Avatar} alt={student.Name} className="table-avatar" />
                  </td>
                  <td>{student.Name}</td>
                  <td>{student.Phone}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(student)}>
                      ✏️ Sửa
                    </button>
                    <button className="btn-delete" onClick={() => deleteStudent(student.id)}>
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
