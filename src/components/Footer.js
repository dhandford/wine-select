import { APP_VERSION } from '../version';

export default function Footer() {
    return (
        <footer style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: "#666" }}>
            Wine Selector v{APP_VERSION}
            <br />
            <span style={{ fontSize: 12 }}>
                Capacity figures from published sources.
            </span>
        </footer>
    );
}