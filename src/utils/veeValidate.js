import Vue from 'vue'
import VeeValidate from "vee-validate"
import zh_CN from 'vee-validate/dist/locale/zh_CN'
// 使用基本的vee-validate,现在其实就可以使用了
Vue.use(VeeValidate)

// 错误信息提示本地化
VeeValidate.Validator.localize('zh_CN', {
  messages: {
    ...zh_CN.messages,
    // 这里修改了内置规则的message,让密码和确认密码必须相同
    is: (field) => `${field}必须和密码相同`  
  },
  attributes: { // 给叫i眼的field属性名映射中文名称和name属性的名称对应
    phone:'手机号码',
    code:'验证码',
    password:'密码',
    repeatPassword:'确认密码',
    agree:'协议'
  }
})
// 插件没有勾选必须统一勾选按钮的规则,这里是自定义规则
VeeValidate.Validator.extend('agree',{
  validate: value=>{
    return value
  },
  getMessage: field => field + '必须同意'
})