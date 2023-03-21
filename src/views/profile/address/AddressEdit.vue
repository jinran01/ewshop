<template>
    <div class="address-edit-box">
        <Navbar class="nav-bar">
            <template v-slot:default>{{ title }}</template>
        </Navbar>
        <van-address-edit
            class="edit"
            :area-list="AreaList"
            :address-info="addressInfo"
            :show-delete="type == 'edit'"
            show-set-default
            show-search-result
            :search-result="searchResult"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"

        />
    </div>
</template>

<script>

import Navbar from "@/components/common/navbar/Navbar";
import {useRouter,useRoute} from "vue-router";
import {computed, onMounted, reactive, toRefs} from "vue";
import {tdist} from "@/utils/address";
import {addAddress, DeleteAddress, EditAddress, getAddressDetail, getCity_id,is_default} from "@/network/address";
import {Area, Toast} from "vant";







export default {
    name: "AddressEdit",
    components:{
        Navbar,
    },
    setup(){
        const route = useRoute();
        const router = useRouter();
        const state = reactive({
            AreaList:{
                province_list:{},
                city_list:{},
                county_list:{}
            },
            searchResult:[],
            addressInfo:{},
            type:'add',
            addressId:'',

        })


        onMounted(()=>{
            //省市区 列表 构造
            let _province_list = {}
            let _city_list = {}
            let _county_list = {}

            tdist.getLev1().forEach(p=>{
                _province_list[p.id] = p.text;
                tdist.getLev2(p.id).forEach(c=>{
                    _city_list[c.id] = c.text;
                    tdist.getLev3(c.id).forEach(q=>{
                        _county_list[q.id] = q.text;
                    })
                })
            })
            state.AreaList.province_list = _province_list;
            state.AreaList.city_list = _city_list;
            state.AreaList.county_list = _county_list;

            const {type,addressId} = route.query;
            state.type = type;
            state.addressId = addressId;

            // console.log(city);
            if(type == 'edit') {
                getAddressDetail(addressId).then(res=>{
                    const addressDetail = res;
                  // console.log(addressDetail)
                    let _areaCode = ''

                    const province = tdist.getLev1()

                    Object.entries(state.AreaList.county_list).forEach(([id, text]) => {
                        // 先找出当前对应的区
                      if (text == addressDetail.city_name.county){
                            // 找到区对应的几个省份
                            const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
                            // 找到区对应的几个市区
                            // eslint-disable-next-line no-unused-vars
                            const cityItem = Object.entries(state.AreaList.city_list).filter(([cityId, city]) => cityId.substr(0, 4) == id.substr(0, 4))[0]
                            // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
                            if (province[provinceIndex].text == addressDetail.city_name.province && cityItem[1] == addressDetail.city_name.city) {
                                _areaCode = id
                            }
                        }
                    })


                    state.addressInfo = {
                        name:addressDetail.name,
                        tel:addressDetail.phone,
                        // province: addressDetail.province,
                        // city:addressDetail.city,
                        // county:addressDetail.county,
                        areaCode:_areaCode,
                        city_id:addressDetail.city_id,
                        addressDetail:addressDetail.address,
                        isDefault: !!addressDetail.is_default
                    }

                    // console.log(state.addressInfo)
                })
            }
        })
        const title = computed(()=>{
            return state.type=='add' ? '新增地址' : '编辑地址';
        })

            const onSave = (content) => {
                let data = reactive({});
                getCity_id(content.county).then(res=>{
                  // data.city_id = 10
                  data.city_id = res;
                  // console.log(data.city_id);
                })
                let params = {
                    name:content.name,
                    phone:content.tel,
                    province:content.province,
                    city:content.city,
                    county:content.county,
                    address:content.addressDetail,
                    is_default:content.isDefault ? 1 : 0,
                    // city_id:0,
                }

                data = params;

                if (params.is_default == 1 ){
                    is_default(state.addressId)
                }

                if (params.is_default == 0 && state.addressInfo.isDefault == true){
                  return Toast.fail('至少要有一个默认地址')
                  // console.log(params.is_default,state.addressInfo.isDefault)
                  // Toast.fail('至少要有一个默认地址')
                }
                // console.log(params.is_default,state.addressInfo.isDefault)
                if (state.type =='edit'){
                      // 修改数据
                    setTimeout(()=>{
                          //调用编辑地址接口
                          EditAddress(state.addressId,data)
                        }, 700)
                }
                else if(state.type =='add'){
                    setTimeout(()=>{
                      //调用添加地址接口
                      addAddress(data)
                    }, 700)
                }
                Toast.success("保存成功")
                setTimeout(()=>{
                    router.back();
                }, 1000)
            }
            const onDelete = () => {
                DeleteAddress(state.addressId).then(res=>{
                    Toast("删除成功")
                    setTimeout(()=>{
                        router.back();
                    }, 1200)
                })
            }
            return{
                ...toRefs(state),
                onSave,
                onDelete,
                title,

            }
    }
}
</script>

<style scoped lang="scss">
.edit {
    .van-field__body {
        textarea {
            height: 26px!important;
        }
    }
}
.address-edit-box {
    margin-top: 50px;
}
</style>
