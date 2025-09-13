import UserSubmit from './UserSubmit.js'
import AdminIssue from './AdminIssue.js'
export default function Routes(app){
    app.use('/',UserSubmit)
    app.use('/',AdminIssue)
}