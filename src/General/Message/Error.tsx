import './Main.css'

function Error({Error}: { Error: string }) {
    return (
        <div id='Popup' key={Math.random()} className='Error'>
            <h1 id='Message'>{Error}</h1>
        </div>
    )
}

export default Error