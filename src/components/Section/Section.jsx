import styles from './Section.module.scss';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import ArrowDrop from '@/icons/arrow-drop.svg';
import TimelineIcon from '@/components/TimelineIcon';
import { useStateValue } from '@/context/StateProvider';
import useToggleVisibility from '@/helpers/useToggleVisibility';
import clsx from 'clsx';

import { useRouter } from 'next/router';

function Section({ title, id, children, Icon, expandToggle, expandedIds, bodyHeight }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const [{ visible, navbarWidth }] = useStateValue();
  useToggleVisibility(ref, bodyHeight);

  const router = useRouter();

  const childrenIds = children.map((child) => child.props.id);

  const toggle = () => {
    if (isOpen) {
      expandToggle(childrenIds, 'clear');
      setIsOpen(false);
    } else {
      expandToggle(childrenIds, 'add');
      setIsOpen(true);
    }
  };

  useEffect(() => {
    /* Find if at least one of the section children Id is part list of expanded Id's */
    let expandedId = childrenIds.find((childrenId) => {
      if (expandedIds.includes(childrenId)) {
        return true;
      }
    });

    if (expandedId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    if (router.asPath) {
      const target = router.asPath.split('#')[1];
      if (target === id && target) {
        const element = document.getElementById(target);
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [expandedIds, bodyHeight, navbarWidth]);

  return (
    <div className={styles.container} role="region" onClick={toggle} id={`${id}-section`}>
      <h2 id={id} ref={ref} className={styles.title}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-pressed={isOpen}
          className={clsx({ [styles.active]: visible[0] === id })}
          aria-controls={`${id}-section-content`}
          aria-label={title}
          onClick={toggle}
        >
          <ArrowDrop style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          {title}
        </button>
      </h2>
      <div className={styles.body} id={`${id}-section-content`} role="region">
        {children}
      </div>
      <div className={styles.timelineIcon}>
        <TimelineIcon isActive={visible[0] === id}>
          <Icon />
        </TimelineIcon>
      </div>
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  Icon: PropTypes.elementType.isRequired,
  expandToggle: PropTypes.func.isRequired,
  expandedIds: PropTypes.array,
  bodyHeight: PropTypes.number,
};

export default Section;
