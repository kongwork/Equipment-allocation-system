const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

// เรียกใช้ middleware
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(session({ secret: "mysession", resave: false, saveUninitialized: false }))
app.use(express.static(path.join(__dirname, 'public')))

// รวม routes เป็น modules
const routes = [
    // Admin routes
    require('./routes/index'),
    require('./routes/login'),
    require('./routes/logout'),
    require('./routes/admin/page/user'),
    require('./routes/admin/page/device'),
    require('./routes/admin/page/category'),
    require('./routes/admin/add_data/user'),
    require('./routes/admin/add_data/device'),
    require('./routes/admin/add_data/category'),
    require('./routes/admin/delete_data/user'),
    require('./routes/admin/delete_data/device'),
    require('./routes/admin/delete_data/category'),
    require('./routes/admin/edit_data/user'),
    require('./routes/admin/edit_data/device'),
    require('./routes/admin/edit_data/category'),
    require('./routes/admin/edit_data/dispose_device'),
    require('./routes/admin/search_data/user'),
    require('./routes/admin/search_data/device'),
    require('./routes/admin/search_data/category'),
    // User routes
    require('./routes/user/page/order'),
    require('./routes/user/page/history'),
    require('./routes/user/add_data/order'),
    require('./routes/user/delete_data/order'),
    require('./routes/user/edit_data/order'),
    require('./routes/user/report/order'),
    require('./routes/user/report/devices')
]

// นำ routes มารวมเป็น middleware
app.use(routes)

// ตั้งค่า view engine และ views
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/admin'),
    path.join(__dirname, 'views/report'),
    path.join(__dirname, 'views/user')
])

app.set('view engine', 'ejs')
  
// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


/*const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const index = require('./routes/index')
const login = require('./routes/login')
const logout = require('./routes/logout')

// admin page
const admin_page_user = require('./routes/admin/page/user')
const admin_page_device = require('./routes/admin/page/device')
const admin_page_category = require('./routes/admin/page/category')
// add data
const add_data_user = require('./routes/admin/add_data/user')
const add_data_device = require('./routes/admin/add_data/device')
const add_data_category = require('./routes/admin/add_data/category')
// delete data
const delete_data_user = require('./routes/admin/delete_data/user')
const delete_data_device = require('./routes/admin/delete_data/device')
const delete_data_category = require('./routes/admin/delete_data/category')
// edit data
const edit_data_user = require('./routes/admin/edit_data/user')
const edit_data_device = require('./routes/admin/edit_data/device')
const edit_data_category = require('./routes/admin/edit_data/category')
const edit_data_dispose_device = require('./routes/admin/edit_data/dispose_device')
// search data
const search_data_user = require('./routes/admin/search_data/user')
const search_data_device = require('./routes/admin/search_data/device')
const search_data_category = require('./routes/admin/search_data/category')

// page for user
const user_page_order = require('./routes/user/page/order')
const user_page_order_history = require('./routes/user/page/history')
// add data
const add_data_order = require('./routes/user/add_data/order')
// delete data
const delete_data_order = require('./routes/user/delete_data/order')
// edit data
const edit_data_order = require('./routes/user/edit_data/order')
// report
const report_order = require('./routes/user/report/order')
const report_devices = require('./routes/user/report/devices')


const app = express()

app.set('views', [
    __dirname + '/views',
    __dirname + '/views/admin',
    __dirname + '/views/report',
    __dirname + '/views/user' 
])
app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(session({ secret: "mysession", resave: false, saveUninitialized: false }))
app.use(
    index,
    login,
    logout,
    //page for admin
    admin_page_user,
    admin_page_device,
    admin_page_category,
    //add data
    add_data_user,
    add_data_device,
    add_data_category,
    //delete data
    delete_data_user,
    delete_data_device,
    delete_data_category,
    //edit data
    edit_data_user,
    edit_data_device,
    edit_data_category,
    edit_data_dispose_device,
    //search data
    search_data_user,
    search_data_device,
    search_data_category,

    //page for user
    user_page_order,
    user_page_order_history,
    //add data
    add_data_order,
    //delete data
    delete_data_order,
    //edit data
    edit_data_order,
    //report
    report_order,
    report_devices
)
app.use(express.static(path.join(__dirname, 'public')))

app.listen(8080, () => {
    console.log('Server is running');
})*/