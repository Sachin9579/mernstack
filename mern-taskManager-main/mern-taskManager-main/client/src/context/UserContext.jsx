import { createContext, useState } from "react"
export const UserContext = createContext({})
export function UserContextProvider({ children }) {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("")
  const [duedate, setDuedate] = useState(null)
  const [inputs, setInputs] = useState([])
  const [showCheckPopup, setShowCheckPopup] = useState(false)
  const [showLogPopup, setShowLogPopup] = useState(false)
  const [showDelPopup, setShowDelPopup] = useState(false)
  const [toDoCards, setToDoCards] = useState([])
  const [backlogCards, setBacklogCards] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [doneCards, setDoneCards] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [delSelectId, setDelSelectId] = useState(null)
  const [openDropdownIds, setOpenDropdownIds] = useState({
    todo: [],
    backlog: [],
    done: [],
    progress: []
  })
  const [shareCard, setShareCard] = useState({
    heading: "",
    prior: "",
    date: null,
    fields: [],
    stat: ""
  })

  const [refresh, setRefresh] = useState(false)

  return (
    <UserContext.Provider
      value={{
        showCheckPopup,
        setShowCheckPopup,
        showLogPopup,
        setShowLogPopup,
        showDelPopup,
        setShowDelPopup,
        toDoCards,
        setToDoCards,
        backlogCards,
        setBacklogCards,
        inProgress,
        setInProgress,
        doneCards,
        setDoneCards,
        setTitle,
        setPriority,
        setDuedate,
        setInputs,
        title,
        priority,
        duedate,
        inputs,
        selectedId,
        setSelectedId,
        refresh,
        setRefresh,
        openDropdownIds,
        setOpenDropdownIds,
        delSelectId,
        setDelSelectId,
        shareCard,
        setShareCard
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
