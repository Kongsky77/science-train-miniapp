<template>
  <view class="select -school">
    <scroll-view class="index-school">
      <!-- <span>怎么回事？</span> -->
      <van-index-bar>
        <view>
          <!-- <van-index-anchor index="A" /> -->
          <van-cell v-for="(item, index) of districts" :key="index">
            <spna slot="title">{{ item }}</spna>
          </van-cell>
          <!-- <van-cell title="{{}}" /> -->
        </view>
      </van-index-bar>
    </scroll-view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import QQMapWX from "@/js/qqmap-wx-jssdk";
import DistrictService from "@/service/DistrictService";

@Component({
  name: "District",
  components: {},
})
export default class District extends Vue {
  districtService = new DistrictService();
  @Prop() city = "";
  @Prop() cityCode = "51";
  @Prop() page = 1;

  isDistrict = false;
  districts: Array<any> = [];
  offsetTop = 0;

  mounted() {
    // this.getSchools(this.city, this.page);
    // this.getOffsetTop();
    this.getDistrict(this.city, this.cityCode);
  }

  onLoad(option) {
    console.log("这里测试页面是否跳转正确", option);
  }

  getOffsetTop() {
    const that = this;
    uni.getSystemInfo({
      success: function (e) {
        console.log("这里测试窗口高度", e.windowHeight);
        that.offsetTop = e.windowHeight - 100;
      },
    });
  }

  getDistrict(city: string, cityCode: string) {
    console.log("这里测试zujian是否正确", city);
    this.districtService.getDistricts(cityCode).then((res) => {
      if (res.success && res.data) {
        const data = res.data;
        this.districts = data.map((item) => item.name);
      }
    });
  }

  selectSchool(school: string) {
    this.$emit("selectSchool", school);
    console.log("您选择了这个学校", school);
  }
}
</script>
<style lang="scss" scoped>
.select -school {
  height: 200rpx;
}
// .index-school {
//   height: 400rpx;
// }
</style>
