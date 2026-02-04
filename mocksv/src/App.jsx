import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://69829b249c3efeb892a2bfb9.mockapi.io/api/sinhvien/sinhvien'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ mssv: '', ho: '', ten: '', lop: '', diem1: '', diem2: '' })
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
    if (!formData.mssv || !formData.ho || !formData.ten) {
      alert('Vui lòng điền MSSV, Họ và Tên')
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
      setFormData({ mssv: '', ho: '', ten: '', lop: '', diem1: '', diem2: '' })
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  // Update - Edit student
  const updateStudent = async (e) => {
    e.preventDefault()
    if (!formData.mssv || !formData.ho || !formData.ten) {
      alert('Vui lòng điền MSSV, Họ và Tên')
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
      setFormData({ mssv: '', ho: '', ten: '', lop: '', diem1: '', diem2: '' })
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
    setFormData({ mssv: student.mssv, ho: student.ho, ten: student.ten, lop: student.lop || '', diem1: student.diem1 || '', diem2: student.diem2 || '' })
    setEditingId(student.id)
  }

  // Reset form
  const handleCancel = () => {
    setFormData({ mssv: '', ho: '', ten: '', lop: '', diem1: '', diem2: '' })
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
            placeholder="MSSV"
            value={formData.mssv}
            onChange={(e) => setFormData({ ...formData, mssv: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Họ"
            value={formData.ho}
            onChange={(e) => setFormData({ ...formData, ho: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Tên"
            value={formData.ten}
            onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Lớp"
            value={formData.lop}
            onChange={(e) => setFormData({ ...formData, lop: e.target.value })}
          />
          <input
            type="number"
            placeholder="Điểm 1"
            value={formData.diem1}
            onChange={(e) => setFormData({ ...formData, diem1: e.target.value })}
          />
          <input
            type="number"
            placeholder="Điểm 2"
            value={formData.diem2}
            onChange={(e) => setFormData({ ...formData, diem2: e.target.value })}
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
                <th>MSSV</th>
                <th>Họ</th>
                <th>Tên</th>
                <th>Lớp</th>
                <th>Điểm 1</th>
                <th>Điểm 2</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.mssv}</td>
                  <td>{student.ho}</td>
                  <td>{student.ten}</td>
                  <td>{student.lop || '-'}</td>
                  <td>{student.diem1 || '-'}</td>
                  <td>{student.diem2 || '-'}</td>
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
