<template>
  <view
    class="select-school"
    :class="{ 'select-school--kjg': isKjgTheme }"
  >
    <view class="search-shcool">
      <van-field
        clickable
        label="省"
        readonly
        :value="provinceText"
        placeholder="选择省"
        @click.native="onClick('province')"
      />
      <van-field
        clickable
        readonly
        label="市"
        :value="cityText"
        placeholder="选择市"
        @click.native="onClick('city')"
      />
      <van-field
        v-if="!doNotShowCounty"
        clickable
        label="区县"
        readonly
        :value="districtText"
        placeholder="选择区县"
        @click.native="onClick('district')"
      />
      <van-field
        clickable
        label="学校"
        :value="schoolName"
        placeholder="选择学校，若无法找到，手动输入后点确定"
        @change="querySchool"
        @focus="onClick('school')"
        @blur="onBlurClick"
      />
      <view class="confirm-button" v-if="schoolls.length === 0 && !isShowConfirmButton" 
        @click="confirmSchool(schoolName)">
        <span>确定</span>
      </view>
    </view>
   
    
    <scroll-view class="index-school" scroll-y v-if="isSchool">
      <van-index-bar>
        <view>
          <van-cell
              v-for="(item) of schoolls"
              :key="item.id"
              :class="{ 'school-item--selected': selectedSchoolId === item.id }"
              @click="selectSchool(item)"
          >
            <span slot="title">{{ item.name }}</span>
          </van-cell>
          <van-empty
            v-if="schoolls.length === 0"
            description="未找到学校，可直接输入名称后确定"
          />
        </view>
      </van-index-bar>
    </scroll-view>
    <view class="bottom-page" v-if="Number(pages) > 1">
      <span class="pre-page" @click="prePage">上一页</span>
      <span class="page-num">{{ pageNo }} / {{ pages }}</span>
      <span class="next-page" @click="nextPage">下一页</span>
    </view>
    <view class="bottom-page sure-btn" v-if="isShowConfirmButton" @click="confirmSchool(schoolName)">
      <span>确定</span>
    </view>

    <van-popup
      :show="selectShow"
      :loading="isLoadingSelect"
      position="bottom"
      style="z-index: 1111111;position: relative;"
    >
      <van-picker
        title="请选择"
        show-toolbar
        value-key="name"
        :columns="curColumns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
    
  </view>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QQMapWX from "@/js/qqmap-wx-jssdk";
import ActivityService from "@/service/ActivityService";
import ListRequest from "@/beans/activity/req/ListRequest";
import { Mutation } from "vuex-class";

@Component({
  name: "SelectScholl",
  components: {},
})
export default class SelectSchool extends Vue {
  data = new ListRequest();
  activityService = new ActivityService();

  selectShow: boolean = false;
  showPicker: boolean = false;
  provinceCode: string= "1000022";
  cityCode: string;
  districtCode: string;
  provinceText="四川省";
  cityText:string="";
  districtText:string="";
  curType:string = '';
  provinceList:any[] = [];
  curColumns = [];
  isLoadingSelect:boolean  = false;
  isSelectedSchool:boolean  = false;
  doNotShowCounty:boolean  = false;
  isShowConfirmButton:boolean = true;
  pageNo = 1;
  pages = "";
  id = "";
  latitude = 0;
  longitude = 0;
  city = "成都市";
  // cityName:string=''
  // provinceName:string=''
  // districtName:string=''
  isSchool = true;
  schoolName = "";
  selectedSchoolId: string | number = -1;
  schoolls: Array<any> = [];
  schoollObjs: Array<any> = [];
  @Mutation("setChildSchoolName") private setChildSchoolName!: Function;

  get isKjgTheme() {
    return process.env.VUE_APP_THEME_TYPE === "kjg";
  }

    onLoad(options:any) {
      console.log("父级传入数据检测",options);
      if (options) {
          this.schoolName = decodeURIComponent(options.schoolName?options.schoolName:'')
          this.cityText = decodeURIComponent(options.cityName?options.cityName:'')
          this.provinceText = decodeURIComponent(options.provinceName?options.provinceName:'四川省')
          this.districtText = decodeURIComponent(options.districtName?options.districtName:'')
          this.cityCode= decodeURIComponent(options.cityCode?options.cityCode:'');
          this.provinceCode=decodeURIComponent(options.provinceCode?options.provinceCode:"1000022")
          this.districtCode=decodeURIComponent(options.districtCode?options.districtCode:"")

      }
    }

  mounted() {
    // this.getLocationDetail()
    // this.getSchools(this.city);
    // this.reverseLoacion();

    this.queryPickerList("-1");
    this.querySchools(this.pageNo, "");
  }

  // 选择省市县
  async onClick(type){
    this.curType = type;
    if(type === 'school' ) {
      this.querySchools(this.pageNo, "");
      return;
    }
    if(type === 'city' ) {
      if(this.provinceCode) {
        await this.queryPickerList(this.provinceCode, 'cityList')

      } else {
        uni.showToast({
          title: "请先选择省",
          icon: "none",
          position: "center",
        });
        return;
      }
    }
    if(type === 'district' ) {
      console.log("county--",this.cityCode);
      
      if(this.cityCode) {
        await this.queryPickerList(this.cityCode, 'districtList');
        // if(this.countyList?.length===0) return;
      } else {
          uni.showToast({
            title: "请先选择市",
            icon: "none",
            position: "center",
          });
          return;
        }
    }
    this.curColumns = this[type+'List'];
    this.selectShow = true;
  }

  onConfirm(e) {
    if(this.curType === 'province' && e.detail.value.id !== this.provinceCode){
      this.cityCode = null;
      this.cityText = '';
      this.districtCode = null;
      this.districtText = '';
      this.doNotShowCounty = false;
    }
    if(this.curType === 'city' && e.detail.value.id !== this.cityCode){
      this.districtCode = null;
      this.districtText = '';
      this.doNotShowCounty = false;
    }
    this[this.curType+'Text'] = e.detail.value.name;
    this[this.curType+'Code'] = e.detail.value.id;
    this.selectShow = false;

  }
  onCancel() {
    this.selectShow = false;
  }

  querySchool(e) {
    this.isSelectedSchool = false;
    this.selectedSchoolId = -1;
    this.isShowConfirmButton = false;
    this.schoolName = e.detail;
    this.pageNo = 1;
    this.querySchools(this.pageNo, this.schoolName);
    // console.log("这里测试是否发生了拜年话", this.schoolName);
  }

  onBlurClick(){
    this.isShowConfirmButton = true
  }

  // focusSchool() {
  //   this.isSchool = false;
  // }

  get imgUrl() {
    return `${process.env.VUE_APP_BLOB_IMAGE_URL_NEW}/competition-list`;
  }

  getLocationDetail() {
    const _this = this;
    uni.getLocation({
      type: "gcj02",
      success: function(res) {
        // console.log("这里测试this指向哪里", _this);
        _this.latitude = res.latitude;
        _this.longitude = res.longitude;
        _this.reverseLoacion();
      },
    });
    _this.isSchool = true;
  }

  prePage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      // this.getSchools(this.city,this.pageNo,this.schoolName)
      this.querySchools(this.pageNo, this.schoolName);
    } else {
      this.showNotHasPreviousPageNotice();
    }
  }

  nextPage() {
    if (this.pageNo < Number(this.pages)) {
      this.pageNo++;
      // this.getSchools(this.city,this.pageNo,this.schoolName)
      this.querySchools(this.pageNo, this.schoolName);
    } else {
      this.showNotHasNextPageNotice();
    }
  }

  showNotHasPreviousPageNotice() {
    uni.showToast({
      title: "已经是第一页了",
      icon: "none",
      position: "center",
    });
  }

  showNotHasNextPageNotice() {
    uni.showToast({
      title: "已经是最后一页啦，没有下一页了",
      icon: "none",
      position: "center",
    });
  }
  async queryPickerList(code: string, type = 'provinceList') {
    this.isLoadingSelect = true;
    await this.activityService.getPickerList(code).then((res:any) => {
      if (res.success && res.data) {
        const data = res.data;
        if(this.curType=== 'district' && data?.length === 0){
          this.doNotShowCounty = true;
          // return;
        } else if (this.curType=== 'district' && data?.length > 0) {
          this.doNotShowCounty = false;
        }
        this[type] = data;
      }
    }).finally(()=>{
      this.isLoadingSelect = false;
    })
  }

  querySchools(page: number, schoolName: string) {
    this.data.pageNo = page;
    this.data.pageSize = 100;

    this.activityService.getSchoolsPage(this.data, schoolName).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        this.schoollObjs = data.records;
        const schools = data.records.map((item) => item.name);
        this.pageNo = data.pageNo;
        this.pages = data.pages;
        this.schoolls = data.records
      }
    });
  }

  getSchools(city: string, page: number, schoolName: string) {
    this.data.pageNo = page;
    this.data.pageSize = 100;

    this.activityService
      .getSchoolsByCityPage(city, this.data, schoolName)
      .then((res) => {
        if (res.success && res.data) {
          const data = res.data;

        this.pageNo = data.pageNo
        this.pages = data.pages
        this.schoolls = data.records
      }
    })
  }

  reverseLoacion() {
    const that = this;
    const qqMapWx = new QQMapWX({
      key: "66QBZ-TAWK4-CWVUN-DF2US-DMKCH-C7BSU",
    });
    qqMapWx.reverseGeocoder({
      location: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      success: function(res) {
        that.city = res.result.ad_info.city;
        const cityCode = res.result.ad_info.city_code;
        that.cityCode = cityCode;
        that.getSchools(that.city, that.pageNo, that.schoolName);
      },
      fail: function(error) {
        console.error(error);
      },
    });
  }

  selectSchool(school) {
    if (school) {
      // uni.$emit('switchSchool',school.name)
      // uni.$emit('switchSchoolObj',school)
      // uni.navigateBack({
      //   delta: 1,
      // })
      console.log("selectSchool",school);
      
      this.schoolName = school.name;
      this.selectedSchoolId = school.id || -1;
      this.setChildSchoolName(school.name);
      this.isSelectedSchool = true;
    }
  }

  confirmSchool (schoolName) {
    this.isShowConfirmButton = true;
    if (!this.districtCode && !this.doNotShowCounty){
        uni.showToast({
        title: "请先选择地区",
        icon: "none",
        position: "center",
      });
      return;
    }
    if (!this.cityCode && this.doNotShowCounty){
        uni.showToast({
        title: "请先选择地区",
        icon: "none",
        position: "center",
      });
      return;
    }
    if (schoolName) {
      uni.$emit('switchSchool',{
        id:this.selectedSchoolId,
        name:schoolName,
        cityCode: this.cityCode,
        provinceCode: this.provinceCode, 
        districtCode: this.districtCode,
        cityName: this.cityText,
        provinceName: this.provinceText,
        districtName:this.districtText,
      })
      uni.$emit('switchSchoolObj', {
        id:this.selectedSchoolId,
        name:schoolName,
        cityCode: this.cityCode,
        provinceCode: this.provinceCode, 
        districtCode: this.districtCode,
        cityName: this.cityText,
        provinceName: this.provinceText,
        districtName:this.districtText,
      })
      uni.navigateBack({
        delta: 1,
      })
      this.setChildSchoolName(schoolName)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-school {
  min-height: 100vh;
}

.location {
  height: 200rpx;
  width: 100%;
  background-color: rgb(197, 196, 196);
}

.location-span {
  margin: 20rpx;
  font-size: 25rpx;
  color: rgb(94, 93, 93);
}

.location-button {
  margin: 20rpx;
}

.index-school {
  z-index: 500;
}

.search-shcool {
  position: sticky;
  top: 0;
  z-index: 1000;
}
.confirm-button{
    background-color: #fff;
    height: 80rpx;
    width: 100%;
    z-index: 2000;
    display: flex;
    justify-content: center;
    margin-top: 15rpx;
    align-items: center;
}
.bottom-page {
  background-color: #fff;
  position: fixed;
  height: 80rpx;
  width: 100%;
  bottom: 80rpx;
  z-index: 2000;
  display: flex;
  flex-direction: row;
  //justify-content: space-between;
  margin-top: 15rpx;
  // padding: 15rpx;
  align-items: center;
  &.sure-btn{
    bottom: 0;
  }
}

.bottom-page span {
  flex: 1;
  display: inline-block;
  margin: 15rpx;
  text-align: center;
}

.select-school--kjg {
  min-height: 100vh;
  padding-bottom: calc(104rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: linear-gradient(180deg, #f7f3ea 0%, #edf7f7 52%, #f8fbfa 100%);
  color: #17365f;

  .search-shcool {
    top: 0;
    padding: 18rpx 20rpx;
    border-bottom: 2rpx solid #d5e8ec;
    background: rgba(247, 243, 234, 0.96);
    box-shadow: 0 8rpx 22rpx rgba(18, 71, 103, 0.07);
  }

  /deep/ .search-shcool .van-cell {
    min-height: 86rpx;
    margin-bottom: 10rpx;
    border: 2rpx solid #d4e7eb;
    border-radius: 16rpx;
    background: #fffdfa;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 0;
    }
  }

  /deep/ .search-shcool .van-field__label {
    color: #567086;
    font-size: 26rpx;
  }

  /deep/ .search-shcool .van-field__control {
    color: #17365f;
    font-size: 26rpx;
  }

  .confirm-button {
    height: 76rpx;
    margin-top: 10rpx;
    border: 2rpx solid #8dcfca;
    border-radius: 16rpx;
    background: #eff9f7;
    color: #FAC12A;
    font-size: 27rpx;
    font-weight: 600;
  }

  .index-school {
    height: calc(100vh - 520rpx);
    padding: 18rpx 20rpx;
    box-sizing: border-box;
  }

  /deep/ .index-school .van-cell {
    min-height: 88rpx;
    margin-bottom: 12rpx;
    border: 2rpx solid #d7e9ed;
    border-radius: 16rpx;
    background: rgba(255, 253, 249, 0.96);
    color: #244563;
    box-shadow: 0 6rpx 16rpx rgba(18, 71, 103, 0.05);
  }

  /deep/ .school-item--selected .van-cell {
    border-color: #1b63d9;
    background: #f1f6ff;
    color: #123d73;
  }

  .bottom-page {
    right: 20rpx;
    bottom: calc(88rpx + env(safe-area-inset-bottom));
    left: 20rpx;
    width: auto;
    height: 72rpx;
    margin: 0;
    border: 2rpx solid #c6e1e7;
    border-radius: 16rpx;
    background: rgba(255, 253, 249, 0.97);
    color: #567086;
    box-shadow: 0 8rpx 22rpx rgba(18, 71, 103, 0.08);

    span {
      margin: 0;
      font-size: 25rpx;
    }

    .pre-page,
    .next-page {
      color: #1b63d9;
      font-weight: 600;
    }

    &.sure-btn {
      bottom: calc(12rpx + env(safe-area-inset-bottom));
      height: 68rpx;
      border-color: #1b63d9;
      background: #1b63d9;
      color: #fff;
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}
</style>
