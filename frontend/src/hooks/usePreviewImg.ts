import { ChangeEvent, useState } from "react"
import useShowToast from "./useShowToast";

//!---------------------------------------------------------------------------------!//

interface PreviewImgHook {
    handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    imgUrl: string | null;
    setImgUrl: React.Dispatch<React.SetStateAction<string | null>>
}

//!---------------------------------------------------------------------------------!//

const usePreviewImg = (): PreviewImgHook => {

    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const showToast = useShowToast();

    //*---------------------------------------------------------------------------------*//

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files?.[0] || null; // Primer archivo seleccionado o ante no seleccion se estable como 'null'
        if (file && file.type.startsWith("image/")) { // Verificacion de la existencia de 'file' y si es de tipo 'image/...'
            const reader = new FileReader(); // Lee el contenido del archivo

            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setImgUrl(reader.result);
                }
            };  // Si se llega a completar la lectura se almacenara en imgUrl gracias al seteo setImgUrl

            reader.readAsDataURL(file); // Se leera el archivo seleccionado como una URL
        } else {
            showToast('Tipo de archivo invalido', "Porfavor seleccionar un archivo de tipo 'imagen'", 'error');
            setImgUrl(null);
        };
        // console.log(imgUrl);
    };

    //!---------------------------------------------------------------------------------!//

    return { handleImageChange, imgUrl, setImgUrl };
};

//!---------------------------------------------------------------------------------!//

export default usePreviewImg;