import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://69829b249c3efeb892a2bfb9.mockapi.io/api/sinhvien/sinhvien'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ Name: '', Avatar: '', Phone: '' })
  const [editingId, setEditingId] = useState(null)

  // Read - Get all items
  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error('Error fetching data:', err)
      alert('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  // Create
  const createItem = async (e) => {
    e.preventDefault()
    if (!formData.Name) return alert('Vui lòng nhập tên')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const newItem = await res.json()
      setItems(prev => [...prev, newItem])
      setFormData({ Name: '', Avatar: '', Phone: '' })
    } catch (err) {
      console.error('Error creating item:', err)
      alert('Lỗi khi tạo mục mới')
    }
  }

  // Update
  const updateItem = async (e) => {
    e.preventDefault()
    if (!editingId) return
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === editingId ? updated : i))
      setEditingId(null)
      setFormData({ Name: '', Avatar: '', Phone: '' })
    } catch (err) {
      console.error('Error updating item:', err)
      alert('Lỗi khi cập nhật')
    }
  }

  // Delete
  const deleteItem = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa mục này không?')) return
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      console.error('Error deleting item:', err)
      alert('Lỗi khi xóa')
    }
  }

  const handleEdit = (item) => {
    setFormData({ Name: item.Name || '', Avatar: item.Avatar || '', Phone: item.Phone || '' })
    setEditingId(item.id)
  }

  const handleCancel = () => {
    setFormData({ Name: '', Avatar: '', Phone: '' })
    setEditingId(null)
  }

  useEffect(() => { fetchItems() }, [])

  return (
    <div className="app-container">
      <h1>CRUD Demo — MockAPI</h1>

      <div className="form-section">
        <h2>{editingId ? 'Chỉnh sửa mục' : 'Thêm mục mới'}</h2>
        <form onSubmit={editingId ? updateItem : createItem}>
          <input
            type="text"
            placeholder="Name"
            value={formData.Name}
            onChange={e => setFormData({ ...formData, Name: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Avatar URL"
            value={formData.Avatar}
            onChange={e => setFormData({ ...formData, Avatar: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.Phone}
            onChange={e => setFormData({ ...formData, Phone: e.target.value })}
          />
          <div className="button-group">
            <button type="submit" className="btn-submit">{editingId ? 'Cập nhật' : 'Thêm'}</button>
            {editingId && <button type="button" className="btn-cancel" onClick={handleCancel}>Hủy</button>}
          </div>
        </form>
      </div>

      <div className="list-section">
        <h2>Danh sách ({items.length})</h2>
        <button onClick={fetchItems} className="btn-refresh" disabled={loading}>{loading ? 'Đang tải...' : 'Làm mới'}</button>

        {items.length === 0 ? (
          <p className="no-data">Không có dữ liệu</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.Avatar ? <img src={item.Avatar} alt={item.Name} style={{width:48,height:48,borderRadius:6}}/> : '-'}</td>
                  <td>{item.Name}</td>
                  <td>{item.Phone}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Sửa</button>
                    <button className="btn-delete" onClick={() => deleteItem(item.id)}>Xóa</button>
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
