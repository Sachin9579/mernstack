import React, { useContext, useEffect } from "react"
import Styles from "./SharePage.module.css"
import { FiCodesandbox } from "react-icons/fi"
import { UserContext } from "../../context/UserContext"
import { format, parseISO, isPast } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useParams } from "react-router-dom"

const SharePage = async () => {
  const params = useParams()
  const { shareCard, setShareCard } = useContext(UserContext)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`/api/cards/card/${params.infoId}`)
        const cardData = response.data

        setShareCard({
          heading: cardData.title,
          prior: cardData.priority,
          date: cardData.duedate,
          fields: cardData.inputs,
          stat: cardData.status
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchCard()
  }, [params.infoId])

  const handleCss = (p) => {
    switch (p) {
      case "HIGH PRIORITY":
        return Styles.highPriority
      case "MODERATE PRIORITY":
        return Styles.mediumPriority
      case "LOW PRIORITY":
        return Styles.lowPriority
      default:
        return {}
    }
  }

  const calcLen = () => {
    return shareCard.fields.filter((i) => {
      return i.checked === true
    })
  }
  return (
    <div className={Styles.main}>
      <div className={Styles.sidebar}>
        <p className={Styles.sidebar_logo}>
          <FiCodesandbox className={Styles.logo} />
          Pro Manage
        </p>
      </div>
      <div id={Styles.mycard} className={Styles.card}>
        <div className={Styles.card_top}>
          <div className={Styles.card_lables}>
            <div id={Styles.prior}>
              {" "}
              <span className={handleCss(shareCard.prior)}>&bull;</span>
              <p>{shareCard.prior}</p>
            </div>
          </div>
        </div>
        <div className={Styles.card_title}>{shareCard.heading}</div>
        <div className={Styles.scrolldrop}>
          <button className={Styles.dropdown}>
            Checklist ({calcLen().length}/{shareCard.fields.length}){" "}
          </button>
          <div>
            {
              <ul className={Styles.dropdownItems}>
                {shareCard.fields.map((item) => (
                  <div key={uuidv4()} className={Styles.items}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      className={Styles.checkbox}
                      readOnly
                    />
                    {item.value}
                  </div>
                ))}
              </ul>
            }
          </div>
        </div>
        {shareCard.date && (
          <div className={Styles.footer_due}>
            <p>Due Date</p>
            <div className={Styles.date}>
              {typeof shareCard.date === "string"
                ? format(parseISO(shareCard.date), "MMM do")
                : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SharePage
