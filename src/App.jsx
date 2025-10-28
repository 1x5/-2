import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './App.css'

// Начальные данные
const initialData = [
  { id: 1, name: 'Зефирки черные', category: 'Зефирки', quantity: 2, color: '#000000' },
  { id: 2, name: 'Зефирки серые', category: 'Зефирки', quantity: 15, color: '#808080' },
  { id: 3, name: 'Зефирки бордовые', category: 'Зефирки', quantity: 3, color: '#530908' },
  { id: 4, name: 'М.зефирки черные', category: 'М.зефирки', quantity: 10, color: '#000000' },
  { id: 5, name: 'М.зефирки серые', category: 'М.зефирки', quantity: 25, color: '#808080' },
  { id: 6, name: 'Круасаны', category: 'Круасаны', quantity: 5, color: '#cccccc' },
  { id: 7, name: 'Круасаны серые', category: 'Круасаны', quantity: 8, color: '#808080' },
  { id: 8, name: 'М.Круасаны черные', category: 'М.Круасаны', quantity: 7, color: '#000000' },
]

function App() {
  const [items, setItems] = useState(initialData)
  const [emptyCategories, setEmptyCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('Зефирки')
  const [searchQuery, setSearchQuery] = useState('')
  const [editing, setEditing] = useState({ id: null, field: null }) // id и поле (name/quantity)
  const [editingValue, setEditingValue] = useState('')
  const [swipeOffset, setSwipeOffset] = useState({})
  const [deletingId, setDeletingId] = useState(null)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [newItemCategory, setNewItemCategory] = useState('')
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)
  const [suggestedCategories, setSuggestedCategories] = useState([])
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 })
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('sumki-theme')
    return saved ? saved === 'dark' : true
  })
  const suppressNextBlurSaveRef = useRef(false)
  const inputRef = useRef(null)

  // Функция определения цвета по названию
  const getColorFromName = (name) => {
    const lowerName = name.toLowerCase()
    const colors = {
      'черн': '#000000',
      'сер': '#808080',
      'бел': '#ffffff',
      'красн': '#ff0000',
      'рыж': '#ff8c00',
      'желт': '#ffff00',
      'зелен': '#00ff00',
      'голуб': '#00bfff',
      'син': '#0000ff',
      'фиолет': '#8b00ff',
      'розов': '#ff69b4',
      'бордов': '#8b0000',
      'коричнев': '#8b4513',
      'бежев': '#f5deb3',
    }
    
    for (const [key, color] of Object.entries(colors)) {
      if (lowerName.includes(key)) {
        return color
      }
    }
    
    return '#cccccc' // По умолчанию серый
  }

  // Сохранение темы в localStorage
  useEffect(() => {
    localStorage.setItem('sumki-theme', isDarkTheme ? 'dark' : 'light')
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme'
  }, [isDarkTheme])

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sumki-items')
    if (saved) {
      setItems(JSON.parse(saved))
    }
    const savedEmptyCategories = localStorage.getItem('sumki-empty-categories')
    if (savedEmptyCategories) {
      setEmptyCategories(JSON.parse(savedEmptyCategories))
    }
  }, [])

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('sumki-items', JSON.stringify(items))
  }, [items])
  
  useEffect(() => {
    localStorage.setItem('sumki-empty-categories', JSON.stringify(emptyCategories))
  }, [emptyCategories])

  // Получить уникальные категории
  const categories = ['Все', ...new Set([...items.map(item => item.category), ...emptyCategories].filter(Boolean))]

  // Фильтрация
  const filtered = items.filter(item => {
    const matchesCategory = activeCategory === 'Все' || item.category === activeCategory
    
    // Для поиска игнорируем команды (#, +#, -#)
    let searchText = searchQuery
    if (searchQuery.startsWith('+#') || searchQuery.startsWith('-#') || searchQuery === '#') {
      searchText = ''
    }
    
    const matchesSearch = searchText === '' || item.name.toLowerCase().includes(searchText.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  const filteredItems = filtered.sort((a, b) => {
    // Сначала товары с остатком 0 (окончившиеся)
    if (a.quantity === 0 && b.quantity !== 0) return -1
    if (a.quantity !== 0 && b.quantity === 0) return 1
    // Затем сортируем по возрастанию количества остатков
    return a.quantity - b.quantity
  })

  // Обработчик начала свайпа
  const handleTouchStart = (e, id) => {
    const touch = e.touches[0]
    const startX = touch.clientX
    setSwipeOffset(prev => ({ ...prev, [id]: { startX, offset: prev[id]?.offset || 0 } }))
  }

  // Обработчик движения при свайпе
  const handleTouchMove = (e, id) => {
    const touch = e.touches[0]
    const currentX = touch.clientX
    const deltaX = currentX - swipeOffset[id].startX
    
    // Ограничиваем свайп влево до -100px
    if (deltaX < 0 && Math.abs(deltaX) <= 100) {
      setSwipeOffset(prev => ({
        ...prev,
        [id]: { ...prev[id], offset: deltaX }
      }))
    }
  }

  // Обработчик окончания свайпа
  const handleTouchEnd = (e, id) => {
    const offset = swipeOffset[id]?.offset || 0
    
    // Если свайп более -80px - удаляем
    if (offset < -80) {
      setDeletingId(id)
      // Удаляем сразу из состояния, анимация делается через CSS
      setTimeout(() => {
        setItems(items.filter(item => item.id !== id))
        setDeletingId(null)
        setSwipeOffset({})
      }, 150)
    } else {
      // Иначе возвращаем назад
      setSwipeOffset(prev => ({ ...prev, [id]: { ...prev[id], offset: 0 } }))
    }
  }

  // Начать редактирование
  const startEdit = (id, field, value) => {
    setEditing({ id, field })
    if (field === 'name') {
      const item = items.find(i => i.id === id)
      if (item && item.category) {
        setEditingValue(`${value.toString()} #${item.category}`)
      } else {
        setEditingValue(value.toString())
      }
    } else {
      setEditingValue(value.toString())
    }
    setShowCategorySuggestions(false)
    setSuggestedCategories([])
  }

  // Сохранить изменения
  const saveEdit = (id, field, value) => {
    if (field === 'quantity') {
      const num = parseInt(value)
      if (!isNaN(num) && num >= 0) {
        setItems(items.map(item => 
          item.id === id ? { ...item, quantity: num } : item
        ))
      }
    } else if (field === 'name') {
      // Проверяем удаление категории -#название
      if (value.startsWith('-#') && value.length > 2) {
        const categoryToDelete = value.substring(2).trim()
        if (categoryToDelete) {
          // Удаляем все товары этой категории
          setItems(items.filter(item => item.category !== categoryToDelete))
          setEditing({ id: null, field: null })
          setEditingValue('')
          return
        }
      }
      
      setItems(items.map(item => {
        if (item.id === id) {
          let newName = value
          let newCategory = item.category
          
          // Проверяем есть ли # в названии и есть ли новая категория
          if (newName.includes('#')) {
            const parts = newName.split('#')
            const lastHashIndex = newName.lastIndexOf('#')
            const afterHash = newName.substring(lastHashIndex + 1)
            
            // Получаем имя без категории
            newName = newName.substring(0, lastHashIndex).trim()
            
            // Если есть категория после #
            if (afterHash.trim() !== '') {
              const selectedCategory = afterHash.trim()
              
              // Проверяем, существует ли такая категория в списке существующих
              const existingCategories = ['Все', ...new Set([...items.map(item => item.category), ...emptyCategories].filter(Boolean))]
              const categoryExists = existingCategories.includes(selectedCategory)
              
              if (categoryExists) {
                // Категория существует - меняем категорию товара
                newCategory = selectedCategory
              } else {
                // Категории не существует - не создаем новую, оставляем старую
                console.log('Category does not exist:', selectedCategory, 'keeping current category:', item.category)
              }
            }
            // Если # но нет категории - оставляем прежнюю категорию
          }
          
          const newColor = getColorFromName(newName)
          console.log('Final item:', { name: newName, category: newCategory })
          return { ...item, name: newName, category: newCategory, color: newColor }
        }
        return item
      }))
    }
    setEditing({ id: null, field: null })
    setEditingValue('')
  }

  // Обработка Enter при редактировании
  const handleKeyDown = (e, id, field) => {
    if (e.key === 'Enter') {
      saveEdit(id, field, editingValue)
      setShowCategorySuggestions(false)
    } else if (e.key === 'Escape') {
      setEditing({ id: null, field: null })
      setEditingValue('')
      setShowCategorySuggestions(false)
    }
  }

  // Обновить предложения категорий
  const updateCategorySuggestions = (value, currentItems) => {
    if (value && value.includes('#')) {
      const lastHashIndex = value.lastIndexOf('#')
      const beforeHash = value.substring(0, lastHashIndex)
      const afterHash = value.substring(lastHashIndex + 1)
      const searchTerm = afterHash.trim().toLowerCase()
      const categoriesList = ['Все', ...new Set([...currentItems.map(item => item.category), ...emptyCategories].filter(Boolean))]
      const categoriesToShow = categoriesList.filter(cat => cat !== 'Все' && cat !== undefined)
      
      // Проверяем режим удаления: текст заканчивается на -#
      const isDeleteMode = beforeHash.trim().endsWith('-') || beforeHash.trim() === '-'
      // Проверяем режим создания: начинается с +#
      const isCreateMode = beforeHash.trim().startsWith('+') || beforeHash.trim() === '+'
      
      console.log('updateCategorySuggestions:', { 
        value, 
        beforeHash: `"${beforeHash}"`,
        afterHash, 
        searchTerm, 
        categoriesToShow, 
        isDeleteMode,
        isCreateMode
      })
      
      // Проверяем, находимся ли мы в режиме редактирования названия товара
      const isEditingItemName = editing.id !== null && editing.field === 'name'
      
      // В режиме редактирования товара - показываем только существующие категории
      // Режимы создания (+#) и удаления (-#) доступны только из поиска
      if (isEditingItemName) {
        if (searchTerm === '' || afterHash.trim() === '') {
          console.log('Edit mode - showing all categories:', categoriesToShow)
          setSuggestedCategories(categoriesToShow)
          setShowCategorySuggestions(true)
        } else {
          const filtered = categoriesToShow.filter(cat => 
            cat.toLowerCase().includes(searchTerm)
          )
          console.log('Edit mode - filtered categories:', filtered)
          setSuggestedCategories(filtered)
          setShowCategorySuggestions(filtered.length > 0)
        }
      } else if (isDeleteMode) {
        // Режим удаления - показываем все категории
        if (searchTerm === '' || afterHash.trim() === '') {
          console.log('Delete mode - showing all categories:', categoriesToShow)
          setSuggestedCategories(categoriesToShow)
          setShowCategorySuggestions(true)
        } else {
          // Фильтруем категории для удаления
          const filtered = categoriesToShow.filter(cat => 
            cat.toLowerCase().includes(searchTerm)
          )
          console.log('Delete mode - filtered categories:', filtered)
          setSuggestedCategories(filtered)
          setShowCategorySuggestions(filtered.length > 0)
        }
      } else if (isCreateMode) {
        // Режим создания `+#` - показываем категории для добавления товара
        if (searchTerm === '' || afterHash.trim() === '') {
          console.log('Create mode - showing all categories:', categoriesToShow)
          setSuggestedCategories(categoriesToShow)
          setShowCategorySuggestions(true)
        } else {
          // Фильтруем категории для добавления товара
          const filtered = categoriesToShow.filter(cat => 
            cat.toLowerCase().includes(searchTerm)
          )
          console.log('Create mode - filtered categories:', filtered)
          setSuggestedCategories(filtered)
          setShowCategorySuggestions(filtered.length > 0)
        }
      } else {
        // Обычный режим смены категории
        if (searchTerm === '' || afterHash.trim() === '') {
          // Показываем все категории когда только # введен (без текста после #)
          console.log('Setting all categories:', categoriesToShow)
          setSuggestedCategories(categoriesToShow)
          setShowCategorySuggestions(true)
        } else if (afterHash.length > 0) {
          // Есть текст после # - ищем категорию которая уже выбрана (не показываем подсказки)
          const existingCategory = categoriesToShow.find(cat => cat === afterHash.trim())
          if (existingCategory) {
            // Категория уже выбрана - прячем подсказки
            setShowCategorySuggestions(false)
          } else {
            // Фильтруем по поисковому запросу
            const filtered = categoriesToShow.filter(cat => 
              cat.toLowerCase().includes(searchTerm)
            )
            console.log('Setting filtered categories:', filtered)
            setSuggestedCategories(filtered)
            setShowCategorySuggestions(filtered.length > 0)
          }
        }
      }
    } else {
      setShowCategorySuggestions(false)
    }
  }

  // Выбрать категорию из предложений
  const selectCategory = (id, category) => {
    console.log('selectCategory called:', { id, category, searchQuery })
    
    // Режим удаления -#
    if (searchQuery.trim().endsWith('-#')) {
      console.log('Deleting category from search:', category)
      // Удаляем товары этой категории
      setItems(currentItems => {
        const filtered = currentItems.filter(item => item.category !== category)
        return filtered
      })
      // Удаляем из пустых категорий если есть
      setEmptyCategories(prev => prev.filter(cat => cat !== category))
      setSearchQuery('')
      setShowCategorySuggestions(false)
      return
    }
    
    // Режим создания +#
    if (searchQuery.startsWith('+#')) {
      console.log('Adding item to category from +#:', category)
      const newId = Math.max(...items.map(i => i.id), 0) + 1
      const newItem = {
        id: newId,
        name: 'Новый товар',
        category: category,
        quantity: 0,
        color: getColorFromName('Новый товар')
      }
      setItems([...items, newItem])
      setEditing({ id: newId, field: 'name' })
      setEditingValue('Новый товар')
      setSearchQuery('')
      setShowCategorySuggestions(false)
      return
    }
    
    // Редактирование товара - меняем категорию
    if (editing.id !== null && editing.field === 'name') {
      // Заменяем категорию в editingValue
      const currentValue = editingValue
      const hashIndex = currentValue.indexOf('#')
      
      let newValue
      if (hashIndex !== -1) {
        const beforeHash = currentValue.substring(0, hashIndex).trim()
        newValue = `${beforeHash} #${category}`
      } else {
        // Если нет #, добавляем категорию
        newValue = `${currentValue} #${category}`
      }
      
      setEditingValue(newValue)
      setShowCategorySuggestions(false)
      
      // Сразу сохраняем изменения
      suppressNextBlurSaveRef.current = true
      saveEdit(editing.id, 'name', newValue)
      
      return
    }
    
    // Обычный режим # в поиске - показываем категории, но не делаем ничего при клике
    setShowCategorySuggestions(false)
    setSearchQuery('')
  }

  // Добавить новый товар
  const handleAddItem = () => {
    if (activeCategory === 'Все') {
      setShowAddItemModal(true)
      setNewItemCategory(categories[1]) // Первая категория после "Все"
    } else {
      // Создаем новый товар в активной категории
      const newId = Math.max(...items.map(i => i.id), 0) + 1
      const newItem = {
        id: newId,
        name: 'Новый товар',
        category: activeCategory,
        quantity: 0,
        color: getColorFromName('Новый товар')
      }
      setItems([...items, newItem])
      setEditing({ id: newId, field: 'name' })
      setEditingValue('Новый товар')
    }
  }

  // Подтверждение добавления товара
  const handleConfirmAddItem = () => {
    const newId = Math.max(...items.map(i => i.id), 0) + 1
    const newItem = {
      id: newId,
      name: 'Новый товар',
      category: newItemCategory,
      quantity: 0,
      color: getColorFromName('Новый товар')
    }
    setItems([...items, newItem])
    setEditing({ id: newId, field: 'name' })
    setEditingValue('Новый товар')
    setShowAddItemModal(false)
    if (activeCategory !== newItemCategory) {
      setActiveCategory(newItemCategory)
    }
  }

  return (
    <div className="app">
      {/* Поиск и кнопка + */}
      <div className="search-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Поиск" 
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value
              setSearchQuery(value)
              
              // Обработка команд в поиске
              if (value.includes('#')) {
                updateCategorySuggestions(value, items)
              } else {
                setShowCategorySuggestions(false)
              }
            }}
            onKeyDown={(e) => {
              // Команда создания новой категории через +#текст + Enter
              if (e.key === 'Enter') {
                if (searchQuery.startsWith('+#') && searchQuery.length > 2) {
                  const categoryName = searchQuery.substring(2).trim()
                  if (categoryName && !emptyCategories.includes(categoryName)) {
                    // Создаем пустую категорию
                    setEmptyCategories([...emptyCategories, categoryName])
                    setSearchQuery('')
                    setShowCategorySuggestions(false)
                  }
                }
              }
            }}
            onBlur={() => {
              // Очищаем команды при потере фокуса
              if (searchQuery === '-#' || searchQuery === '+#' || searchQuery === '#') {
                setTimeout(() => {
                  setSearchQuery('')
                  setShowCategorySuggestions(false)
                }, 100)
              }
            }}
            
            onKeyPress={(e) => {
              // Дополнительная обработка для iOS
              if (e.key === 'Enter' || e.which === 13) {
                if (searchQuery.startsWith('+#') && searchQuery.length > 2) {
                  const categoryName = searchQuery.substring(2).trim()
                  if (categoryName && !emptyCategories.includes(categoryName)) {
                    // Создаем пустую категорию
                    setEmptyCategories([...emptyCategories, categoryName])
                    setSearchQuery('')
                    setShowCategorySuggestions(false)
                  }
                }
              }
            }}
          />
        </div>
        <button className="add-button" onClick={handleAddItem}>
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
            <line x1="9.5" y1="0" x2="9.5" y2="19" stroke="white" strokeWidth="1.5"/>
            <line x1="0" y1="9.5" x2="19" y2="9.5" stroke="white" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>

      {/* Табы категорий */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Список товаров */}
      <div className="items-list">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className={`item-card-wrapper ${deletingId === item.id ? 'deleting' : ''}`}
          >
            <div 
              className={`item-card ${deletingId === item.id ? 'deleting' : ''}`}
              style={{ 
                transform: `translateX(${swipeOffset[item.id]?.offset || 0}px)`,
                transition: deletingId === item.id ? 'all 0.3s ease' : 'transform 0.1s ease'
              }}
              onTouchStart={(e) => handleTouchStart(e, item.id)}
              onTouchMove={(e) => handleTouchMove(e, item.id)}
              onTouchEnd={(e) => handleTouchEnd(e, item.id)}
            >
            {/* Индикатор цвета */}
            <div
              className="color-indicator"
              style={{ backgroundColor: item.color }}
            />

            {/* Название товара */}
            <div 
              className="item-name"
              onClick={() => startEdit(item.id, 'name', item.name)}
            >
                {editing.id === item.id && editing.field === 'name' ? (
                <div className="item-name-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    className="edit-input-name"
                    value={editingValue}
                    onChange={(e) => {
                      const newValue = e.target.value
                      setEditingValue(newValue)
                      updateCategorySuggestions(newValue, items)
                      // Обновляем позицию подсказок
                      if (inputRef.current) {
                        const rect = inputRef.current.getBoundingClientRect()
                        const hashIndex = newValue.lastIndexOf('#')
                        let leftPos = rect.left
                        
                        // Если есть #, вычисляем позицию после решетки
                        if (hashIndex !== -1) {
                          const canvas = document.createElement('canvas')
                          const ctx = canvas.getContext('2d')
                          ctx.font = '13px "DM Mono", monospace'
                          const textBeforeHash = newValue.substring(0, hashIndex)
                          const textWidth = ctx.measureText(textBeforeHash).width
                          leftPos = rect.left + textWidth
                        }
                        
                        setSuggestionPosition({ top: rect.bottom + window.scrollY, left: leftPos })
                      }
                    }}
                    onBlur={(e) => {
                      setTimeout(() => {
                        if (suppressNextBlurSaveRef.current) {
                          suppressNextBlurSaveRef.current = false
                          return
                        }
                        // Проверяем, не кликнули ли на подсказку
                        if (!document.querySelector('.category-suggestions:hover')) {
                          saveEdit(item.id, 'name', editingValue)
                          setShowCategorySuggestions(false)
                          setEditing({ id: null, field: null })
                        }
                      }, 200)
                    }}
                    onKeyDown={(e) => handleKeyDown(e, item.id, 'name')}
                    autoFocus
                  />
                </div>
              ) : (
                <span>{item.name || 'Новый товар'}</span>
              )}
            </div>

            {/* Количество */}
            <div 
              className="item-quantity"
              onClick={() => startEdit(item.id, 'quantity', item.quantity)}
            >
              {editing.id === item.id && editing.field === 'quantity' ? (
                <input
                  type="number"
                  className="edit-input-quantity"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => saveEdit(item.id, 'quantity', editingValue)}
                  onKeyDown={(e) => handleKeyDown(e, item.id, 'quantity')}
                  autoFocus
                />
              ) : (
                <span className={item.quantity < 10 ? 'low-stock' : ''}>
                  {item.quantity}
                </span>
              )}
            </div>
            </div>
            
            {/* Красный индикатор удаления */}
            <div 
              className={`delete-indicator ${swipeOffset[item.id]?.offset < -20 ? 'visible' : ''}`}
            >
              <span className="delete-text">Удалить</span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">Нет товаров</div>
      )}

      {/* Кнопка переключения темы */}
      <button 
        className="theme-toggle"
        onClick={() => setIsDarkTheme(!isDarkTheme)}
      >
        {isDarkTheme ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Модальное окно выбора модели для нового товара */}
      {showAddItemModal && (
        <div className="modal-overlay" onClick={() => setShowAddItemModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Выберите модель</h3>
            <div className="modal-categories">
              {categories.slice(1).map(category => (
                <button
                  key={category}
                  className={`modal-category-btn ${newItemCategory === category ? 'active' : ''}`}
                  onClick={() => setNewItemCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowAddItemModal(false)}>
                Отмена
              </button>
              <button className="modal-confirm-btn" onClick={handleConfirmAddItem}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Подсказки категорий через портал - для поиска и редактирования */}
      {(() => {
        const shouldShow = showCategorySuggestions && (searchQuery.includes('#') || (editing.id !== null && editing.field === 'name')) && suggestedCategories.length > 0
        console.log('Should show suggestions portal:', shouldShow, { showCategorySuggestions, searchQuery, editingField: editing.field, suggestedCategoriesLength: suggestedCategories.length })
        return shouldShow && (
        createPortal(
          <div 
            className="category-suggestions" 
            style={{ 
              position: 'fixed',
              top: editing.id !== null && editing.field === 'name' ? `${suggestionPosition.top}px` : '100px',
              left: editing.id !== null && editing.field === 'name' ? `${suggestionPosition.left}px` : '50%',
              transform: editing.id !== null && editing.field === 'name' ? 'none' : 'translateX(-50%)',
              width: editing.id !== null && editing.field === 'name' ? '300px' : 'calc(100% - 40px)',
              maxWidth: '400px'
            }}
          >
            {suggestedCategories.map(category => (
              <button
                key={category}
                className="category-suggestion-item"
                onClick={() => selectCategory(null, category)}
              >
                {category}
              </button>
            ))}
          </div>,
          document.body
        )
        )
      })()}
    </div>
  )
}

export default App
