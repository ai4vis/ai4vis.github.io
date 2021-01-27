import {
    Slider,
    Tooltip,
    Modal,
    Icon,
    Tag,
    Divider,
    Checkbox,
    Menu,
    Button
} from "ant-design-vue"
const ant = {
    install(Vue: {
        component: (arg0: string, arg1: any) => void;
    }) {
        Vue.component(Slider.name, Slider)
        Vue.component(Tooltip.name, Tooltip)
        Vue.component(Modal.name, Modal)
        Vue.component(Icon.name, Icon)
        Vue.component(Tag.name, Tag)
        Vue.component(Divider.name, Divider)
        Vue.component(Checkbox.name, Checkbox)
        Vue.component(Menu.name, Menu)
        Vue.component(Menu.Item.name, Menu.Item)
        Vue.component(Button.name, Button)
    }
};
export default ant