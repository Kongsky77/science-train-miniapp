<template>
  <view class="dynamic-form">
    <view class="notice">
      <span v-if="form.required" style="color: red; margin: 0 10rpx 0 0;">*</span>
      {{form.name}}
    </view>
    <view class="filed" >
      <view style="width: 100%">
        <van-field
          v-model="fieldText"
          :border="false"
          is-link
          readonly
          clickable
          :placeholder="`${form.placeholder !== '' ? form.placeholder : '请选择'}`"
          @click-input="onCascaderFieldClick(form)"
          @click-icon="onCascaderFieldClick(form)"
        />
      </view>       
    </view>  
    <van-popup :show="showCascader" round position="bottom"
      close-on-click-overlay
      safe-area-inset-bottom
    >
      <van-cascader
        v-if="showCascader"
        v-model="cascaderValue"
        :options="cascaderOptions"
        @close="onCascaderCancel"
        @finish="onCascaderFinish"
        :key="cascaderCountKey"
      />
    </van-popup>
  </view>
</template>
<script lang="ts">
import { Component,Vue,Prop } from 'vue-property-decorator'
import FormResponse from '@/beans/common/FormResponse'
import FormTypeComponentNameMap from '@/definition/common/FormTypeComponentNameMap'
import FormTypeEnum from '@/enums/common/FormTypeEnum'

class FormConfig extends FormResponse {
  value = ''
}

@Component({
  name: FormTypeComponentNameMap.get(FormTypeEnum.CASCADER),
  components: {},
})
export default class DynamicFormCascader extends Vue {
  @Prop() form!: FormResponse

  fieldValue =''
  fieldText =''
  cascaderOptions: any[] = []

  showCascader = false
  cascaderCountKey = 0

  cascaderValue = ''

  mounted() {
      if (this.form.options !== '') {
        this.fieldValue = this.form.value
        try {
          this.cascaderOptions = JSON.parse(this.form.options.replace(/\\/g, ''));
        } catch (e) {
          console.error("Invalid JSON string: ", e);
        }
        if (this.form.value !== '') {
          this.fieldText = this.getFieldTextFromValue(this.form.value, this.cascaderOptions)
        }
      }
  }

  getFieldTextFromValue(value:string, options: any[]):string {
    let text = ''
    if (value !== '') {
      const valueArray = value.split('/')
      const option = options.find((item:any) => item.value === valueArray[0])
      if (option) {
        text = option.text
        if (valueArray.length > 1) {
          text += '/' + this.getFieldTextFromValue(valueArray.slice(1).join('/'), option.children)
        }
      }
    }
    return text
  }
  
  onCascaderFinish(selected:any) {
    this.showCascader = false;
    this.fieldText = selected.detail.selectedOptions.map((item:any) => item.text).join('/')
    this.fieldValue = selected.detail.selectedOptions.map((item:any) => item.value).join('/')
    this.$emit('change',this.fieldValue)
  }

  onCascaderFieldClick(form: FormConfig) {
    this.cascaderCountKey++
    this.showCascader = true
  }

  onCascaderCancel() {
    this.showCascader = false;
  }
}
</script>

<style lang="scss" scoped>
.notice {
  font-size: 36rpx;
  padding: 30rpx 0 0  0;
}
.filed {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #efefef;
}
</style>
