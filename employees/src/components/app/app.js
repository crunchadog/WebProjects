import {Component} from "react";

import AppInfo from '../appInfo/appInfo';
import SearchPanel from '../searchPanel/searchPanel';
import AppFilter from '../appFilter/appFilter';
import EmployeesList from "../employeesList/employeesList";
import EmployeesAddForm from "../employeesAddForm/employeesAddForm";

import './app.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                {name: "Miss Jackson", salary: '300', increase: false, like: true, id: 1},
                {name: "Big Bob", salary: '500', increase: true, like: false, id: 2},
                {name: "Mister Twister", salary: '800', increase: false, like: false, id: 3},
            ],

            term: '',
            filter: 'all'
        }

        this.maxId = 4;
    }

    deleteItem = (id) => {
        this.setState(({data}) => {
            return {
                data: data.filter(item => item.id !== id),
            }
        })
    }

    addItem = (name, salary) => {
        const newData = {
            name: name,
            salary: salary,
            increase: false,
            id: this.maxId++,
        }

        this.setState(({data}) => {
            const newArr = [...data, newData];
            return {
                data: newArr,
            }
        })
    }

    onToggleProp = (id, prop) => {
        this.setState(({data}) => ({
            data: data.map(item => {
                if (item.id === id) {
                    return {
                        ...item, [prop]: !item[prop]
                    }
                }

                return item;
            })
        }))
    }

    searchEmp = (items, terms) => {
        if (terms.length === 0) {
            return items;
        }

        return items.filter(item => {
            return item.name.indexOf(terms) > -1;
        })
    }

    onUpdateSearch = (term) => {
        this.setState({term});
    }

    filterPost = (items, filter) => {
        switch (filter) {
            case 'like':
                return items.filter(item => item.like);
            case 'moreThen800':
                return items.filter(item => item.salary >= 800);
            default:
                return items;

        }
    }

    onFilterSelect = (filter) => {
        this.setState({filter});
    }

    render() {
        const {data, term, filter} = this.state;
        const employees = this.state.data.length;
        const increased = this.state.data.filter(item => item.increase).length;
        const visibleData = this.filterPost(this.searchEmp(data, term), filter);

        return (
            <div className={'app'}>
                <AppInfo
                    employees={employees}
                    increased={increased}/>

                <div className="searchPanel">
                    <SearchPanel onUpdateSearch={this.onUpdateSearch}/>
                    <AppFilter filter={filter} onFilterSelect={this.onFilterSelect}/>
                </div>

                <EmployeesList
                    data={visibleData}
                    onDelete={this.deleteItem}
                    onToggleProp={this.onToggleProp}/>
                <EmployeesAddForm
                    addEmployee={this.addItem}/>
            </div>
        );
    }
}

export default App;