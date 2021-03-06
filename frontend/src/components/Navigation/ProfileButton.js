import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '../../store/session';

const ProfileButton = ({user}) => {
   const dispatch = useDispatch();
   const [showMenu, setShowMenu] = useState(false);

   useEffect(() => {
      if (!showMenu) return;

      const closeMenu = () => {
         setShowMenu(false);
      };
      document.addEventListener('click', closeMenu);
      return () => document.removeEventListener("click", closeMenu);

   }, [showMenu]);


   const signOut = (e) => {
      e.preventDefault();
      dispatch(logout());
   }

   return (
      <>
         <button onClick={signOut} className="nav-btn">Log Out</button>
      </>
   );
};

export default ProfileButton;
