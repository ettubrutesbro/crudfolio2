import Floater from './Floater'
import styles from './FloaterContainer.module.css'

const FloaterContainer = ({ activeFloaters, onCloseFloater }) => {
  return (
    <div className={styles.floaterContainer}>
      {activeFloaters.map(([projectId, floaterData]) => (
        <Floater
          key={projectId}
          isOpen={true}
          onClose={() => onCloseFloater(projectId)}
          title={floaterData.name}
          content={floaterData.blurb}
          isTall={floaterData.isTall}
          imageId={floaterData.id}
          rowRect={floaterData.rect}

          
        />
      ))}
    </div>
  )
}

export default FloaterContainer
