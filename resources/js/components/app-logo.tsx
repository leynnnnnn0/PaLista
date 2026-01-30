import AppLogoIcon from './app-logo-icon';
import Logo from '../../images/mainLogo.png'
export default function AppLogo() {
    return (
        <>
            <div className="flex items-center gap-2 ml-1 flex-1 text-left text-sm">
                <img className='size-8' src={Logo} alt="My Pautang Log Logo" />{' '}
                <span className="font-bold text-[#1e293b]">
                    My Pautang <span className="text-secondary">Log</span>
                </span>
            </div>
        </>
    );
}
