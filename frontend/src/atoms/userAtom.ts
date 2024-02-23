import { atom } from "recoil";

//!---------------------------------------------------------------------------------!//

const storedValue = localStorage.getItem('user-threads');
const initialValue = storedValue ? JSON.parse(storedValue) : null;

const userAtom = atom({
    key: 'userAtom',
    default: initialValue
});

//!---------------------------------------------------------------------------------!//

export default userAtom;