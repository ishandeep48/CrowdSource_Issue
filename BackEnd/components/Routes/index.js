import UserSubmit from './UserSubmit.js'
import AdminIssue from './AdminIssue.js'
import UserAuth from './UserAuth.js'
import AdminAuth from './AdminAuth.js'
import UserData from './UserData.js'
import AdminActions from './AdminActions.js'
import DepartmentIssue from './DepartmentIssue.js'

export default function Routes(app){
    app.use('/',UserSubmit)
    app.use('/',AdminIssue)
    app.use('/',UserAuth)
    app.use('/',AdminAuth)
    app.use('/',UserData)
    app.use('/',AdminActions)
    app.use('/',DepartmentIssue)


}