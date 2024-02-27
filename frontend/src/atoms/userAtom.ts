import { atom } from "recoil";
import { User } from "../components/UserHeader";

//!---------------------------------------------------------------------------------!//

const storedValue = localStorage.getItem('user-threads'); // Intenta obtener un valor almacenado en LocalStorage bajo la clave 'user-threads'
const initialValue = storedValue ? JSON.parse(storedValue) : null; // En caso de haber valor se lo analizara como JSON, caso contrario 'initialValue' sera nulo

const userAtom = atom<User | null>({
    key: 'userAtom',
    default: initialValue
});

//!---------------------------------------------------------------------------------!//

export default userAtom;