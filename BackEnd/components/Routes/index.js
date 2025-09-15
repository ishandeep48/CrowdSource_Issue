import UserSubmit from './UserSubmit.js'
import AdminIssue from './AdminIssue.js'
import UserAuth from './UserAuth.js'
import AdminAuth from './AdminAuth.js'
export default function Routes(app){
    app.use('/',UserSubmit)
    app.use('/',AdminIssue)
    app.use('/',UserAuth)
    app.use('/',AdminAuth)
}