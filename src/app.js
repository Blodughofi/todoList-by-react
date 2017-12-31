import {BrowserRouter as Router,Route} from 'react-router-dom';
import Item from 'components/Item.js';
import Footer from 'components/Footer.js';
require('style/base.css');
require('style/index.css');

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state={
            todosData:[],
            inputValue:'',
            view:'all'
        };
        this.handleKeyDownPost=this.handleKeyDownPost.bind(this);
        this.onDestroy=this.onDestroy.bind(this);
        this.onClearCompleted=this.onClearCompleted.bind(this);
        this.inputChanged=this.inputChanged.bind(this);
        this.toggleAll=this.toggleAll.bind(this);
        this.onToggle=this.onToggle.bind(this);
        this.itemEditDone=this.itemEditDone.bind(this);
    }

    itemEditDone(todo,value){

        let {todosData}=this.state;

        todosData=todosData.map((elt)=>{
            if(todo.id===elt.id){
                elt.value=value;
            }
            return elt;
        });

    }


    toggleAll(ev){
        let {checked}=ev.target;

        let {todosData}=this.state;

        todosData=todosData.map((elt)=>{
            elt.hasCompleted=checked;
            return elt;
        });

        this.setState({todosData});
    }

    onToggle(todo){
        let {todosData}=this.state;

        todosData=todosData.map((elt)=>{
            if(elt.id===todo.id){
                elt.hasCompleted=!elt.hasCompleted;
            }
            return elt;
        });

        this.setState({todosData});
    }

    inputChanged(ev){
        this.setState({
            inputValue:ev.target.value
        })
    }

    handleKeyDownPost(ev){
        if(ev.keyCode!==13) return;
        let {inputValue}=this.state;
        let value=inputValue.trim();
        if(value=='')return ;
        let todo={};
        todo.id=new Date().getTime();
        todo.value=value;
        todo.hasCompleted=false;

        let {todosData}=this.state;
        todosData.push(todo);

        this.setState({todosData,inputValue:''});

    }

    onDestroy(todo){
        let {todosData}=this.state;

        todosData=todosData.filter((elt)=>{
            return elt.id!==todo.id;
        });

        this.setState({todosData});
    }

    onClearCompleted(){
        let {todosData}=this.state;

        todosData=todosData.filter((elt)=>{
            return !elt.hasCompleted;
        });

        this.setState({todosData});
    }

    render(){

        let {handleKeyDownPost,onDestroy,onClearCompleted,inputChanged,onToggle,toggleAll,itemEditDone}=this;

        let {todosData,inputValue}=this.state;

        let {location:{pathname}}=this.props;


        let items=null,
               footer=null,
               itemBox=null;

        let leftCount=todosData.length;

        items=todosData.filter(elt=>{
            switch(pathname){
                case '/active':
                    return !elt.hasCompleted;
                case '/completed':
                    return elt.hasCompleted;
                default :
                    return true;
            }
        });

        items=items.map((elt,i)=>{
            if(elt.hasCompleted) leftCount--;
           return <Item
                   key={i}
                   {...{
                       onDestroy,
                       todo:elt,
                       onToggle,
                       itemEditDone
           }}/>
        });

        if(todosData.length){
            footer=(
                    <Footer
                            {...{
                                onClearCompleted,
                                leftCount,
                                showClearBtn:leftCount<todosData.length,
                                pathname
                            }}
                    />
            );
            itemBox=(
                    <section className='main'>
                        <input type='checkbox'
                               checked={leftCount===0}
                               onChange={toggleAll}
                               className='toggle-all' />
                        <ul className='todo-list'>
                            {items}
                        </ul>
                    </section>
            )
        }


        return (
                <div>
                    <header className='header'>
                        <h1>todos</h1>
                        <input type='text'
                               value={inputValue}
                               className='new-todo'
                               onKeyDown={handleKeyDownPost}
                               onChange={inputChanged}
                               placeholder='type something here'
                        />
                    </header>
                    {itemBox}
                    {footer}
                </div>
        );
    }
}
ReactDOM.render(
        <Router>
            <Route path='/' component={App}/>
        </Router>,
        document.getElementById('root')
);
if(module.hot){
    module.hot.accept()
}