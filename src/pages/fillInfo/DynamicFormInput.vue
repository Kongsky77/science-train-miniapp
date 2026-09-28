<template>
  <view class="dynamic-form">
      <view class="notice">
        <span v-if="form.required" style="color: red; margin: 0 10rpx 0 0;">*</span>
        {{form.name}}
      </view>
      <view class="filed">
        <view style="width: 100%">
          <van-field
              v-model="form.value"
              :border="false"
              type="textarea"
              style=""
              autosize
              :placeholder="`${form.placeholder !== '' ? form.placeholder : '请输入'}`"
              input-align="left"
              @change="onFormChange(form, '$event')"
          />
        </view>       
      </view>       
  </view>
</template>
<script lang="ts">
import { Component,Vue,Prop } from 'vue-property-decorator'
import FormResponse from '@/beans/common/FormResponse'
import FormTypeComponentNameMap from "@/definition/common/FormTypeComponentNameMap";
import FormTypeEnum from "@/enums/common/FormTypeEnum";
@Component({
  name: FormTypeComponentNameMap.get(FormTypeEnum.INPUT),
  components: {},
})
export default class DynamicFormInput extends Vue {
  @Prop() form!: FormResponse

  onFormChange (form: FormResponse,event: any) {
    this.$emit('change',event.detail)
  }
}
</script>

<style lang="scss" scoped>
.notice {
  padding: 30rpx 0 0  0;
  font-size: 36rpx;
}
.filed {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #efefef;
}
</style>
