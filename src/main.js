import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import {CountDown,Skeleton,Area,Step,Steps,Uploader,CellGroup,PullRefresh,List,ActionSheet,
    ContactCard,Popup,Grid,GridItem,AddressEdit,AddressList, Icon,SubmitBar,CheckboxGroup,
    SwipeCell,Stepper,Checkbox,Field,Form,Tag, Button, Image, Card,Tab, Tabs, Swipe, SwipeItem,
    Lazyload,Badge,Sidebar, SidebarItem, Collapse, CollapseItem } from 'vant';

createApp(App)
    .use(Swipe).use(SwipeItem).use(Lazyload,{
        loading:require("./assets/images/default.png")
    }).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse)
    .use(CollapseItem).use(Tab).use(Tabs).use(Card)
    .use(Image).use(Tag).use(Button).use(Form).use(Field).use(CellGroup)
    .use(SwipeCell).use(CheckboxGroup).use(SubmitBar).use(Stepper).use(Checkbox)
    .use(ActionSheet).use(Icon).use(AddressList).use(AddressEdit).use(Area)
    .use(ContactCard).use(Popup).use(Grid).use(GridItem).use(PullRefresh).use(List)
    .use(Skeleton).use(CountDown).use(Step).use(Steps).use(Uploader)
    .use(store).use(router).mount('#app')
