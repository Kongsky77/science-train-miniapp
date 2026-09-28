import FormTypeEnum from "@/enums/common/FormTypeEnum"
import DynamicFormComponentName from "./DynamicFormComponentName"

const FormTypeComponentNameMap: Map<FormTypeEnum,string> = new Map<FormTypeEnum,string>([
  [ FormTypeEnum.INPUT,DynamicFormComponentName.DYNAMIC_FORM_INPUT ],
  [ FormTypeEnum.CASCADER,DynamicFormComponentName.DYNAMIC_FORM_CASCADER ],
  [ FormTypeEnum.UPLOAD,DynamicFormComponentName.DYNAMIC_FORM_UPLOAD ]
])


export default FormTypeComponentNameMap
