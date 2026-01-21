import Floater from './Floater'
import styles from './FloaterContainer.module.css'

const FloaterContainer = ({ activeFloaters }) => {
  console.log(activeFloaters)
  return (
    <div className = {styles.floaterContainer}>
      {activeFloaters.map((e,i)=> {
        return <Floater
          key = {e.projectID}
          i = {e.i}
          title = {e.name}
          content = {e.blurb}
          isTall = {e.isTall}
          imageId = {e.id}
          rowRect = {e.rowRect}
        />
      })}
    </div>
  )
  // return (
  //   <div className={styles.floaterContainer}>
  //     {activeFloaters.length > 0 && activeFloaters.map(([projectId, floaterData]) => (
  //       <Floater
  //         key={projectId}
  //         isOpen={true}
  //         onClose={() => onCloseFloater(projectId)}
  //         title={floaterData.name}
  //         content={floaterData.blurb}
  //         isTall={floaterData.isTall}
  //         imageId={floaterData.id}
  //         rowRect={floaterData.rect}

          
  //       />
  //     ))}
  //   </div>
  // )
}

export default FloaterContainer
