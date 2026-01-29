import AppLogoIcon from './app-logo-icon';
import Logo from '../../images/logo.png'
export default function AppLogo() {
    return (
        <>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <img src={Logo} alt="My Pautang Log Logo" />
            </div>
        </>
    );
}
