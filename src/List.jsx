import { auto } from "@popperjs/core";
import React from "react";
import { useState, useEffect } from "react";


function List() {
    const [allLists, setAllLists] = useState(JSON.parse(localStorage.getItem('allShopLists')) || {
        "Основной": {
            items: [],
            originallyItems: [],
            howToSort: 'date',
            handSort: []
        },
        "Второй": {
            items: [],
            originallyItems: [],
            howToSort: 'date',
            handSort: []
        }
        },
    );
    const [currentListName, setCurrentListName] = useState(JSON.parse(localStorage.getItem('currentListName')) || 'Основной')
    const [allListsName, setAllListsName] = useState(JSON.parse(localStorage.getItem('allListsName')) || ['Основной', "Второй"])

    const currentListData = allLists[currentListName] || 
    {
        items: [],
        originallyItems: [],
        howToSort: 'date',
        handSort: []}
    
    // items - список который мы показываем в доме bySelfOrder
    const [items, setItems] = useState(currentListData.items); 
    // originallyItems - список с сохранением порядка добавления
    const [originallyItems, setOriginallyItems] = useState(currentListData.originallyItems); 
    const [howToSort, setHowToSort] = useState(currentListData.howToSort); 
    const [handSort, setHandSort] = useState(currentListData.handSort); 

    const [groccery, setGroccery] = useState('')

    useEffect(() => {
        if (currentListName) {
            setAllLists(prev => {
                const updatedAllLists = {
                    ...prev,
                    [currentListName]: {
                        items: items,
                        originallyItems: originallyItems,
                        howToSort: howToSort,
                        handSort: handSort
                    }
                }
                localStorage.setItem('allShopLists', JSON.stringify(updatedAllLists))
                return updatedAllLists
            }
        )}
    }, [currentListName, items, originallyItems, howToSort, handSort])

    useEffect( () => {
        if (currentListName && allLists[currentListName]) {
            const listData = allLists[currentListName]
            setItems(listData.items)
            setOriginallyItems(listData.originallyItems)
            setHowToSort(listData.howToSort)
            setHandSort(listData.handSort)
        }
        localStorage.setItem('currentListName', JSON.stringify(currentListName))
    }, [currentListName]
    )

    useEffect(() => {
        localStorage.setItem('allShopLists', JSON.stringify(allLists))
    }, [allLists])

    useEffect(() => {
        localStorage.setItem('allListsName', JSON.stringify(allListsName))
    }, [allListsName])

    const newList = items.map((text) => {
        let color = '#e6d9d9a4'
        let underlined = 'none'
        if (text.completed === true) {
            color = '#7cc4a794'
            underlined = 'line-through'
        }
        let count = 1
        if (count >= 10) {
            count = 1
        }
        return  (
            <li key={text.id}>
                <div style={{ display: "inline-flex", width: '32px'}}>
                    <button className="transportElement" title="Поднять вверх по списку"  onClick={() => replace(text.id, 'up')}>↑</button>
                    <button className="transportElement" title="Опустить вниз по списку"  onClick={() => replace(text.id, 'down')}>↓</button>
                </div>
                <button className="elementOfList" style={{textDecoration: underlined, backgroundColor: color}}
                    onClick={() => Complete(text.id)}><div className="nameOfElement" style={{width: '90%', display: "inline-flex", flexWrap: 'wrap',
                    whiteSpace: 'normal', wordBreak: 'break-word',}}>{text.text}</div><div  style={{width: '10%', padding: '2px 0 0 0'}}>
                        <div className="editInElement"><img className="imageOfEdit" title="Изменить" alt="Изменить" src="edit.png" style={{width: '100%'}} onClick={() => edit(text.id)} /></div></div></button>
                <button title="Увеличить количество. Максимум 9, после 9 идет 1" className="addAmount"
                    onClick={() => addAmount(text.id) }
                >x{text.amount}</button>
                <button className="delete"
                    title="Удалить" onClick={() => Delete(text.id)}>X</button>
            </li>
        )
    })

    const listOfNames = allListsName.map((text) => <option key={text} value={[text]}>{text}</option>)

    function replace(id, direction) {
        if (howToSort !== 'handSort') {
            setHowToSort('handSort')
            const newItems = [...handSort]
            setItems(newItems)
            
        } else {
            switch (direction) {
                case 'up':
                    setHandSort(prevItems => {
                        const newList = [...prevItems]
                        const indexA = newList.findIndex(item => item.id === id);
                        if (indexA !== 0) {
                            [newList[indexA - 1], newList[indexA]] = [newList[indexA], newList[indexA - 1]]
                        }
                        setItems(newList)
                        return newList
                    })
                    break
                case 'down':
                    setHandSort(prevItems => {
                        const newList = [...prevItems]
                        const indexA = newList.findIndex(item => item.id === id);
                        if (indexA !== newList.length - 1) {
                            [newList[indexA], newList[indexA + 1]] = [newList[indexA + 1], newList[indexA]]
                        }        
                        setItems(newList)   
                        return newList
                    })
                    break
            }
        }   
    }   

    function addAmount(id) {
        const updateList = (item) => {
            if (item.id === id) {
                if (item.amount >= 9) {
                    return ({...item, amount: 1})
                } else {
                    return ({...item, amount: item.amount + 1})
                }
            }
            return item
        }
        setItems(prevItems => {
            const updatedList = prevItems.map(updateList)
            return updatedList
        })
        setOriginallyItems(prevItems => {
            const updatedList = prevItems.map(updateList)
            return updatedList
        })
        setHandSort(prevItems => {
            const updatedList = prevItems.map(updateList)
            return updatedList
        })
        
    }

    function edit(id) {
        const newName = prompt('Введите новое название: ')
        const fixCompleteForAllLists = () => {
            const fixComplete = (item) => {
            if (item.id === id) {
                return ({...item, completed: !item.completed})
            }
            return item
            }   
            setItems(prevItems => {
                const updatedList = prevItems.map(fixComplete)
                return updatedList
            })
            setOriginallyItems(prevItems => {
                const updatedList = prevItems.map(fixComplete)
                return updatedList
            })
            setHandSort(prevItems => {
                const updatedList = prevItems.map(fixComplete)
                return updatedList
            })
        }
        if (newName) {
            if (newName.trim().length > 0) {
                if (!findElementInList(originallyItems, newName.trim())) {
                    const resultText = newName.trim()[0].toUpperCase() + newName.trim().slice(1)
                    const updateList = (item) => {
                        if (item.id === id) {
                            return ({...item, text: resultText, completed: !item.completed})
                        }
                        return item
                    }
                    setItems(prevItems => {
                        const updatedList = prevItems.map(updateList)
                        return updatedList
                    })
                    setOriginallyItems(prevItems => {
                        const updatedList = prevItems.map(updateList)
                        return updatedList
                    })
                    setHandSort(prevItems => {
                        const updatedList = prevItems.map(updateList)
                        return updatedList
                    })
                } else {
                    fixCompleteForAllLists()
                    alert('Кажется в списке уже есть  такое имя, попробуйте ввести другое')                
                }
            } else {
                fixCompleteForAllLists()
                alert('Упс, кажется вы ничего не ввели :(')
            }
        } else if (newName !== null) {
            fixCompleteForAllLists()
            alert('Упс, кажется вы ничего не ввели :(')
        } else {
            fixCompleteForAllLists()
        }
    }

    function Delete(id) {
        setItems(prevItems => {
            const filteredItems = prevItems.filter((item) => item.id !== id)
            const reindexedItems = filteredItems.map((item, index) => 
                ({...item, id: index + 1}))
            return reindexedItems
        })
        
        setOriginallyItems(prevItems => {
            const filteredItems = prevItems.filter((item) => item.id !== id)
            const reindexedItems = filteredItems.map((item, index) => 
                ({...item, id: index + 1}))
            return reindexedItems
        })

        setHandSort(prevItems => {
            const filteredItems = prevItems.filter((item) => item.id !== id)
            const reindexedItems = filteredItems.map((item, index) => 
                ({...item, id: index + 1}))
            return reindexedItems
        })
    }

    function Complete(id) {
        setItems(prevItems => {
            const updatedList = prevItems.map((item) => item.id === id ?
            {...item, completed: !item.completed} : item)
            return updatedList
        })
        setOriginallyItems(prevItems => {
            const updatedList = prevItems.map((item) => item.id === id ?
            {...item, completed: !item.completed} : item)
            return updatedList
        })
        setHandSort(prevItems => {
            const updatedList = prevItems.map((item) => item.id === id ?
            {...item, completed: !item.completed} : item)
            return updatedList
        })
        
    }

    function addElement() {
        if (groccery.trim().length > 0) {
            if (!findElementInList(originallyItems, groccery.trim())) {
                const newId = items.length + 1
                const resultText = groccery.trim()[0].toUpperCase() + groccery.trim().slice(1)
                const updatedList = [...items, {id: newId, text: resultText, completed: false, amount: 1}]
                setItems(updatedList)
                const updatedOrigList = [...originallyItems, {id: newId, text: resultText, completed: false, amount: 1}]
                setOriginallyItems(updatedOrigList)
                const updatedHandSortList = [...handSort, {id: newId, text: resultText, completed: false, amount: 1}]
                setHandSort(updatedHandSortList)
                setGroccery('')
            } else {
                setGroccery('')
            }     
        }
    }

    
    function addByEnter(e) {
        if (e.key === 'Enter') {
            if (groccery.trim().length > 0) {
                if (!findElementInList(originallyItems, groccery.trim())) {
                    let newId = items.length + 1
                    let resultText = groccery.trim()[0].toUpperCase() + groccery.trim().slice(1)
                    const updatedList = [...items, {id: newId, text: resultText, completed: false, amount: 1}]
                    setItems(updatedList)
                    const updatedOrigList = [...originallyItems, {id: newId, text: resultText, completed: false, amount: 1}]
                    setOriginallyItems(updatedOrigList)
                    const updatedHandSortList = [...handSort, {id: newId, text: resultText, completed: false, amount: 1}]
                    setHandSort(updatedHandSortList)
                    setGroccery('')
                } else {
                    setGroccery('')
                }     
            }
        }
    }

    function deleteList(nameOfList) {
        if (Object.keys(allLists).length <= 1) {
            alert('Это последний список, его удалить нельзя, сначала создайте новый')
            return
        }
        const confirming = confirm(`Вы уверены что хотите удалить список ${nameOfList}?`)
        if (confirming) {
            setAllListsName(prev => {
                const filteredList = prev.filter((name) => name !== nameOfList)
                setCurrentListName(filteredList[0])
                return filteredList
            })
            setAllLists(prev => {
                const updatedList = {...prev}
                delete updatedList[nameOfList]
                return updatedList
            })
            setCurrentListName(allListsName[0])
        } else return
    }

    function switchList(event) {
        const nameOfList = event.target.value
        switch (nameOfList) {
            case 'create':
                const newName = prompt('Введите название нового списка: ')
                if (newName) {
                    if (newName.trim()) {
                        const trimmedName = newName.trim()
                        if (!allLists[trimmedName]) {
                            setAllLists(prev => {
                                const updatedAllLists = {
                                    ...prev,
                                    [trimmedName]: {
                                        items: [],
                                        originallyItems: [],
                                        howToSort: 'date',
                                        handSort: []
                                    }
                                }
                                return updatedAllLists
                            })
                            setAllListsName(prev => [...prev, trimmedName])
                            setCurrentListName(trimmedName)
                        } else {
                            alert('Список с таким именем уже существует. :(')
                        }
                    }
                } else {
                    alert('Упс, кажется вы ничего не ввели :(')
                }
                break;
            default:
                setCurrentListName(nameOfList)
                localStorage.setItem('currentListName', JSON.stringify(nameOfList))
        }
    }

    function editListName(currentName) {
        const newName = prompt('Введите название списка: ')
        if (newName) {
            if (newName.trim().length > 0) {
                if (!findElementInAllListsNames(allListsName, newName.trim())) {
                    setAllListsName(prev => {
                        const neededIndex = prev.findIndex(item => item === currentName)
                        const updatedListOfNames = [...prev]
                        updatedListOfNames[neededIndex] = newName.trim()
                        return updatedListOfNames
                    })
                    setAllLists(prev => {
                        const updatedList = {...prev}
                        delete updatedList[currentName]
                        return updatedList
                    })
                    setCurrentListName(newName.trim())
                } else {
                    alert('Кажется список с таким именем уже существует, попробуйте другое название')                
                }
            } else {
                alert('Упс, кажется вы ничего не ввели :(')
            }
        } else if (newName !== null) {
            alert('Упс, кажется вы ничего не ввели :(')
        }   
    }

    function sortByCompletedFirst(items) {
        const sortedItems = [...items].sort((a, b) => {
            if (a.completed && !b.completed) return -1;
            if (!a.completed && b.completed) return 1;
            return 0
        })
        return sortedItems
    }

    function sortByUnCompletedFirst() {
        const sortedItems = [...items].sort((a, b) => {
            if (!a.completed && b.completed) return -1;
            if (a.completed && !b.completed) return 1;
            return 0;
        })
        return sortedItems
    }

    function findElementInAllListsNames(list, text) {
        const textInLowerCase = text.toLowerCase()
        return list.some(groccery => groccery.toLowerCase() === textInLowerCase)
    }

    function findElementInList(list, text) {
        const textInLowerCase = text.toLowerCase()
        return list.some(groccery => groccery.text.toLowerCase() === textInLowerCase)
    }

    function sortList(event) {
        const selectedValue = event.target.value
        setHowToSort(selectedValue)
        switch (selectedValue) {
            case 'date':
                setItems([...originallyItems])
                break
            case 'completed':
                const sortedCompleted = sortByCompletedFirst(originallyItems)
                setItems(sortedCompleted)
                break
            case 'unCompleted':
                const sortedUnCompleted = sortByUnCompletedFirst(originallyItems)
                setItems(sortedUnCompleted)
                break
            case 'handSort':
                setItems([...handSort])
                break
            default:
                
        }
    }

    function getNewGroc(groc) {
        setGroccery(groc.target.value)
    }

    return (
      <div style={{fontSize:'20px', fontFamily: 'Arial'}}>
        <div className="Heading"><h2 align='center'>Список покупок</h2></div>
        <div className="switchList" align="center" ><div className="divOfChoosingList">Поменять список на : <select className="selectOfList"
            value={'void'} onChange={switchList}>
            <option value={'void'} disabled ></option>
            {listOfNames}
            <option value={'create'}>Создать</option></select> ll </div><div className="divOfButtonBin"><button className="deleteList" title="Удалить список" onClick={() => deleteList(currentListName)}>
                <img className="imageOfDeleteList" alt="Удалить список" src="deleteList.png" /></button></div></div>
        <div className="table"><table style={{width: '91.65%'}}>
            <tbody><tr><td style={{width: '90%'}}><div>{currentListName}</div></td>
            <td style={{width: '6.5%', padding: '2px 5px 0 0'}}><button className="edit"><img className="imageOfEdit" title="Изменить" alt="Изменить" src="edit.png" 
            style={{width: '100%', cursor: 'pointer'}} onClick={() => editListName(currentListName)} /></button></td></tr></tbody></table></div>
        <div style={{flexWrap: 'wrap', display: "inline-flex", margin: '0', padding: '0', width: '91.65%'}}>
            <textarea 
                value={groccery} 
                onChange={getNewGroc}
                onKeyDown={addByEnter}
                placeholder="Введите товар"
                style={{fontSize:'20px', height: '39px', width: '85%',
                    flexWrap: 'wrap', display: "inline-flex",
                    whiteSpace: 'normal', wordBreak: 'break-word', borderRadius: '5px'}}
            />
        
            <button className="add" style={{padding: 'auto ', fontSize:'35px', cursor: 'pointer',
                width: '12%', height:'45px'}} onClick={addElement}>+</button>
        </div>
        <div className="sortList" style={{padding: '10px 0 0 0'}}>Сортировать по: 
            <select onChange={sortList} value={howToSort} style={{margin: ' 0 0 0 7px'}}>
            <option value={'date'}>Времени добавления</option>
            <option value={'completed'}>Выполненным</option>
            <option value={'unCompleted'}>Не выполненным</option>
            <option value={'handSort'}>В своем порядке</option>
            </select>
            </div>
        <div style={{fontSize: '26px'}}>
            <ol className="shopList">{newList}</ol>
        </div>
      </div>
    )

}


export default List