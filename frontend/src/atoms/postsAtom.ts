import { atom } from "recoil";
import { PostType } from "../pages/HomePage";

//!---------------------------------------------------------------------------------!//

const postsAtom = atom<PostType[]>({
    key: 'postsAtom',
    default: []
});

//!---------------------------------------------------------------------------------!//

export default postsAtom;