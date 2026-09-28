<template>
    <view class="dynamic-FormResponse">
        <view class="notice">
            <span v-if="form.required" style="color: red; margin: 0 10rpx 0 0;">*</span>
            {{form.name}}  
        </view>
      
        <checkbox-group class="native-checkbox-group" @change="onCheckbox">
            <view style="display: flex; flex-direction: column; justify-content:space-between;" class="custom-checkbox">
                <checkbox
                    class="native-checkbox"
                    v-for="(item,index) in checkboxOptions"
                    :key="index"
                    :value="item"
                    :checked="result.indexOf(item) !== -1"
                    color="#1989fa"
                >{{ item }}</checkbox>
            </view>
        </checkbox-group>

    </view>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    // import ExpertFormsVO from '@/beans/form/ExpertFormsVO';
    import FormResponse from '@/beans/common/FormResponse';

    @Component
    export default class DynamicFormCheckbox extends Vue {
        @Prop() form!: FormResponse

        checkboxValue =''

        checkboxOptions:string[] = []

        result: string[] = []

        mounted() {
            // console.log("父级传入的多选数据",this.form);
            if (this.form.options !== '') {
                this.checkboxValue = this.form.value
                try {
                  this.checkboxOptions = JSON.parse(this.form.options.replace(/\\/g, ''));
                } catch (e) {
                  console.error("Invalid JSON string: ", e);
                }
                if (this.form.value !== '') {
                  this.result = JSON.parse(this.form.value.replace(/\\/g, ''));
                }
            }
        }

        onCheckbox(event:any){
            const detail = event && event.detail
            const values = Array.isArray(detail)
                ? detail
                : detail && Array.isArray(detail.value)
                ? detail.value
                : []
            this.result = values.slice()

            console.log('选择数据', this.result);
            this.$emit('change',this.result.length > 0 ? JSON.stringify(this.result):'')
        }
    }

</script>

<style scoped lang="scss" >
.notice {
    padding: 30rpx 0 0  0;
    font-size: 36rpx;
}

.native-checkbox-group{
    display: flex;
    justify-content: flex-start;
    font-size: 33rpx;
    color: #c8c9cc;
    padding-left: 34rpx;
    .custom-checkbox{
        .native-checkbox{
            margin: 10px 0 ;
            user-select: all;
            // color: #abacae !important;
            // color:red;
            font-size: 33rpx;
        }
    }
}
</style>
