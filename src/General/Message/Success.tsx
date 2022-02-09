import './Main.css'

function Success({Success}: { Success: string }) {
    return (
        <div id='Popup' key={Math.random()} className='Success'>
            <h1 id='Message'>{Success}</h1>
        </div>
    )
}

export default Success