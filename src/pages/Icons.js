import './Icons.css';

import { FiCamera, FiChevronDown, FiChevronLeft, FiSettings } from "react-icons/fi";

export const SettingsCog = () => {
    return (
        <>
           <FiSettings className={'icon-settings'}/> 
        </>
    )
}

export const Colapse = () => {
    return (
        <>
            <FiChevronDown className={'colapse-btn'} />
        </>
    )
}

export const Expand = () => {
    return (
        <>
            <FiChevronLeft className={'expand-btn'} />
        </>
    )
}

export const Camera = () => {
    return (
        <>
            <FiCamera className='icon-camera' />
        </>
    )
}

