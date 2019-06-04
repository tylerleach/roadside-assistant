<style scoped>
.stats {
    align-items: center;
    justify-content: center;
    padding: 20px 25px;
}
</style>

<template>
    <div>
        <Navigation activeName="Admin"></Navigation>
        <div class="content">
            <Row>
                <AdminSideNav activeName="report"></AdminSideNav>
                <Col span="16" class="stats">
                    <Card v-if="userData" style="width:600px">
                        <p slot="title">User Stats</p>
                        <p><b>Number of members:</b> {{userData.totalNumOfMembers}}</p>
                        <p><b>Number of subscription members:</b> {{userData.totalNumOfSubscription}}</p>
                        <p><b>Number of per-service members:</b> {{userData.totalNumOfPerService}}</p>
                        <p><b>Number of professionals:</b> {{userData.totalNumOfPros}}</p>
                    </Card>
                    <br>
                    <Card v-if="transactionData" style="width:600px">
                        <p slot="title">Profit Stats</p>
                        <p><b>Earnings from subscriptions this year:</b> {{transactionData.totalSubYear}}</p>
                        <p><b>Earnings from services this year:</b> {{transactionData.totalServiceYear}}</p>
                        <p><b>Total earnings this year:</b> {{transactionData.totalOverallYear}}</p>
                        <p><b>Lifetime earnings from subscriptions:</b> {{transactionData.companySubscriptionProfitTotal}}</p>
                        <p><b>Lifetime earning from services:</b> {{transactionData.companyServiceProfitTotal}}</p>
                    </Card>
                </Col>
                <Col span="4"></Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { transactionService, userService } from '@/_services';
import Navigation from '@/components/Navigation';
import AdminSideNav from '@/components/AdminSidebar';

export default {
    data () {
        return {
            transactionData: null,
            userData: null
        }
    },
    components: {
        'Navigation': Navigation,
        'AdminSideNav': AdminSideNav
    },
    created () {
        userService.getUserReportData().then(data => this.userData = data);
        transactionService.getReportData().then(data => this.transactionData = data);
    }
}
</script>
