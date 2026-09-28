<template>
  <view class="page">
    <view class="title">填写信息</view>
    <view class="text">请填写信息</view>
    <!-- <van-icon class-prefix="iconfont" name="iconfont icon-bangzu" color="red"/> -->
    <view class="form-list">
      <view class="form-row">
        <van-icon
          class-prefix="iconfont"
          name="iconfont icon-name"
          color="#929292"
        />
        <!-- <img style="width: 30rpx; height: 30rpx" src="@/static/icon/dizhi.svg" > -->
        <van-field
          :value="name"
          placeholder="请输入昵称"
          :border="false"
          @change="onNameChange"
        />
      </view>
      <!-- <view class="form-row" @click="toggleRolePopup(true)">
        <van-icon name="comment-o" />
        <view class="form-text">选择活动身份</view>
      </view> -->
    </view>
    <view class="submit-btn" @click="submit"> 下一步 </view>
    <view class="bottom-tip"> 温馨提示：昵称需后台审核通过后才会显示</view>
    <van-popup
      :show="gradePopUpVisible"
      position="bottom"
      @click-overlay="toggleGradePopUp(false)"
    >
      <van-picker
        :columns="grades"
        @change="onGradeChange"
        @confirm="onGradeConfirm"
        @cancel="onGradeCancel"
        title="年级"
        show-toolbar
      />
    </van-popup>
    <van-popup
      :show="datePopUpVisible"
      position="bottom"
      @click-overlay="toggleDatePopup(false)"
    >
      <van-datetime-picker
        type="date"
        :min-date="minDate"
        :value="date"
        @confirm="onDateConfirm"
        @cancel="onDateCancel"
        @change="onDateChange"
      />
    </van-popup>
    <van-popup
      :show="rolePopUpVisible"
      position="bottom"
      @click-overlay="toggleRolePopup(false)"
    >
      <van-picker
        :columns="roles"
        @change="onRoleChange"
        show-toolbar
        @confirm="onRoleConfirm"
      />
    </van-popup>
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import ActivityService from "@/service/ActivityService";
import SchoolItem from "@/beans/activity/res/SchoolItem";
import RoleEnum from "@/enums/common/RoleEnum";
import GradeMap from "@/definition/common/GradeMap";
import Roles from "@/definition/common/Roles";
import Grades from "@/definition/common/Grades";
import { Utils } from '@/common/utils/Utils'

@Component({
  name: "FillInfo",
  components: {},
})
export default class WriteFillChildrenInfo extends Vue {
  activityService = new ActivityService();
  gradePopUpVisible = false;
  datePopUpVisible = false;
  rolePopUpVisible = false;
  gradeTitle = "年级：非必填，可忽略";
  dateTitle = "请选择出生日期";
  name = "";
  school = "";
  grade = "";
  date = new Date().getTime();
  role = "";
  gradeSelected = false;
  dateSelected = false;

  schoolObjects: any = [];
  schools: Array<string> = [];

  grades = Grades;

  roles = Roles;
  areaInfo = {
    districtCode: '',
    cityCode: '',
    provinceCode: '',
  }

  currentDate = new Date().getTime();
  minDate = new Date("2000/01/01").getTime();

  toggleDatePopup(visible: boolean) {
    this.datePopUpVisible = visible;
  }

  toggleGradePopUp(visible: boolean) {
    this.gradePopUpVisible = visible;
  }

  toggleRolePopup(visible: boolean) {
    this.rolePopUpVisible = visible;
  }

  onNameChange(event: any) {
    const name = event.detail;
    this.name = name.replace(/\s*/g, "");
    // console.log("这里是为了测试name字段是啥", this.name);
  }

  onSchoolChange(event: any) {
    console.log(event);
    this.school = event.detail;
  }

  onGradeChange(event: any) {
    console.log(event);
    // this.grade = event.detail;
  }

  onGradeConfirm(event: any) {
    const value = event.detail.value;
    this.grade = value;
    this.gradeTitle = value;
    this.gradeSelected = true;
    this.toggleGradePopUp(false);
  }

  onGradeCancel() {
    this.toggleGradePopUp(false);
  }

  onDateConfirm(event: any) {
    const value = event.detail;
    this.date = value;
    this.dateTitle = dayjs(Number(value)).format("YYYY-MM-DD");
    this.dateSelected = true;
    this.toggleDatePopup(false);
  }

  onDateCancel() {
    console.log(1111);
    this.toggleDatePopup(false);
  }

  onDateChange(event: any) {
    console.log(event);
    console.log(1111111111111, event.detaild);
    // this.date = event.detail;
  }

  onRoleChange(event: any) {
    console.log(event);
    // this.role = event.detail;
  }

  onRoleConfirm(event: any) {
    console.log(event);
    this.role = event.detail;
  }

  mounted() {
    this.getSchool();
    uni.$on("switchSchool", ({
      name,
      districtCode,
      cityCode,
      provinceCode
    }) => {
      const school = name;
      this.school = school.replace(/\s*/g, "");
      this.areaInfo = {
        districtCode,
        cityCode,
        provinceCode,
      }
    });
  }

  // 下拉刷新
  onPullDownRefresh() {
    setTimeout(() => {
      this.getSchool();
      uni.stopPullDownRefresh();
    }, 3000);
  }

  getSchool() {
    this.activityService.getSchools().then((res) => {
      if (res.success && res.data) {
        this.schoolObjects = res.data;
        const schools = res.data.map((item) => item.name);
        this.schools = schools;
      }
    });
  }

  getSchoolId(name: string) {
    const matchedSchool = this.schoolObjects.filter(
      (item: SchoolItem) => item.name === name
    );
    if (matchedSchool.length) {
      return matchedSchool[0].id;
    } else {
      return "";
    }
  }

  submit() {
    uni.showToast({
      title: '昵称需后台审核通过后才会显示',
      duration: 5000
    })

    uni.navigateTo({
      url: `/pages/tab/index`,
    });
  }



  selectSchool() {
    uni.navigateTo({
      url: `/pages/selectSchool/index`,
    });
  }
}
</script>
<style >
@import "@/css/iconfont.css";
page {
  background: #fff;
}
</style>
<style scoped>
.page {
  padding: 40rpx 60rpx;
  height: 100%;
  box-sizing: border-box;
  background: url("https://contentdevsa-blob.ai121.net/testcontainer/activity/image/a5313504-927a-430a-95cb-76d6cec0b7ce.png") no-repeat center
    bottom/contain;
}

.title {
  color: #969393;
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.text {
  color: #969393;
  font-size: 28rpx;
  margin-bottom: 40rpx;
}

.form-row {
  display: flex;
  padding: 20rpx;
  border-bottom: 1px solid #efefef;
  height: 80rpx;
  align-items: center;
}

.form-text {
  color: #c8c9cc;
  margin-left: 42rpx;
  font-size: 32rpx;
}

.form-text.active {
  color: #000;
}
.van-cell-ai121 >>> .van-cell {
  width: 150% !important;
}

.van-field-ai121 >>> .van-field__control {
  width: 150% !important;
}

.school-select {
  padding: 0 20rpx;
  padding-left: 40rpx;
  flex: 1;
}

.submit-btn {
  margin-top: 60rpx;
  color: #fff;
  background: #7563f0;
  padding: 30rpx 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 32rpx;
}

.bottom-tip {
  color: #888888;
  font-size: 24rpx;
  text-align: center;
  margin-top: 40rpx;
}
</style>
