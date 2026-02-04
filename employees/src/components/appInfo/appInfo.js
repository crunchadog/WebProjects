import './appInfo.css';

const AppInfo = ({increased, employees}) => {
    return (
        <div className="appInfo">
            <h1>Учет сотрудников в компании Bob.Co</h1>
            <h2>Общее количество сотрудников: {employees} </h2>
            <h2>Премию получают: {increased}</h2>
        </div>
    )
}

export default AppInfo;