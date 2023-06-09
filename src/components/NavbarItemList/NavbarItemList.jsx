import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStateValue } from '@/context/StateProvider';
import { SET_ACTIVE_SECTION, SET_LINK_CLICKED, SET_MORE_ENTITY_SHADOW, SET_PROGRESS } from '@/context/types';
import useIntersection from '@/helpers/useIntersection';
import useScrollDirection from '@/helpers/useScrollDirection';

export default function NavbarItemList({ id, navItems, children }) {
  const ref = useRef();
  const isVisible = useIntersection(ref, navItems, null);
  const [{ visible, activeSection, linkClicked, navbarWidth }, dispatch] = useStateValue();
  const { scrolledUp } = useScrollDirection();

  /* Helps the navbar and navitem to separate scroll from click event */
  const toggleLinkClicked = (value) => {
    dispatch({ type: SET_LINK_CLICKED, payload: value });
  };

  useEffect(() => {
    const updateProgress = (section_id, addedValue) => {
      const listItem = ref.current;

      if (section_id === id && navbarWidth && navItems) {
        const defaultItemMargin = 4.5;
        let progressWidth = Math.floor((listItem.offsetLeft * 100) / navbarWidth) + defaultItemMargin;

        if (addedValue) {
          progressWidth += addedValue;
        }

        dispatch({ type: SET_PROGRESS, payload: progressWidth });
        dispatch({ type: SET_ACTIVE_SECTION, payload: section_id });
        /* It will only scroll to the link of an active header if that link isn't visible on the navbar, this helps us scroll only when neccessary */
        if (!isVisible && !linkClicked) {
          const defaultScrollLeftMargin = -10;
          navItems.current.scrollTo({
            top: 0,
            left: section_id === 'learn' ? defaultScrollLeftMargin : listItem.offsetLeft + defaultScrollLeftMargin,
            behavior: 'smooth',
          });
        }

        setTimeout(() => {
          toggleLinkClicked(false);
        }, 500);

        /* Update the URL with the active section */
        window.history.replaceState({}, null, `ecosystem#${section_id}`);
      }

      if (activeSection === 'learn' && !section_id && scrolledUp) {
        dispatch({ type: SET_PROGRESS, payload: 0 });
        dispatch({ type: SET_ACTIVE_SECTION, payload: null });
      }
    };

    function responsiveness() {
      switch (true) {
        case window.screen.width > 1276:
          updateProgress(visible[0], null);
          break;
        case window.screen.width >= 1024:
          updateProgress(visible[0], -2);
          break;
        case window.screen.width >= 600 && window.screen.width < 1024:
          updateProgress(visible[0], -1);
          break;
        case window.screen.width > 375 && window.screen.width <= 393:
          updateProgress(visible[0], 2);
          break;
        case window.screen.width < 360 && window.screen.width <= 375:
          updateProgress(visible[0], 3);
          break;
        default:
          updateProgress(visible[0], 1);
          break;
      }
    }

    responsiveness();
  }, [visible, navbarWidth, linkClicked]);

  useEffect(() => {
    if (ref.current.id === 'market-li') {
      if (isVisible) {
        dispatch({ type: SET_MORE_ENTITY_SHADOW, payload: false });
      } else {
        dispatch({ type: SET_MORE_ENTITY_SHADOW, payload: true });
      }
    }
  }, [isVisible]);

  return (
    <li id={`${id}-li`} onClick={() => toggleLinkClicked(true)} ref={ref}>
      {children}
    </li>
  );
}

NavbarItemList.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  navItems: PropTypes.object,
};
