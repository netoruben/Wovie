import './Main.css'

export enum MessageType {
    Error ='Error',
    Success = 'Success'
} 

export default class Message {
    MessageType: MessageType
    Message: string

    constructor(Type: MessageType, Message: string) {
        this.MessageType = Type
        this.Message = Message
    }

    getMessage() {
        if (this.MessageType === MessageType.Error) return ( 
                <div id='Popup' key={Math.random()} className='Error'>
                    <h1 id='Message'>{this.Message}</h1>
                </div>
            )
        return ( 
            <div id='Popup' key={Math.random()} className='Success'>
                <h1 id='Message'>{this.Message}</h1>
            </div> 
        )
    }

}