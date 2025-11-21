export default function Dev() {
    const clearStorage = () => {
        localStorage.clear()
    }
    return <button onClick={clearStorage}>Hapus</button>
}