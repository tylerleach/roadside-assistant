<style>
.map {
  width: 1200px;
  height: 800px;
  padding: 20px 25px;
}
.mapSection {
    align-items: center;
    justify-content: center;
    padding: 20px 25px;
}
.detailsSection {
    padding: 20px 25px;
}
</style>

<template>
    <div>
        <Navigation activeName="Requests"></Navigation>
        <div class="content">
            <Row>
                <Col span="4" class="detailsSection">
                    <p>Problem type: <strong>{{request.problemType}}</strong></p>
                    <p>Plate number: <strong>{{request.plateNumber}}</strong></p>
                    <p>Model: <strong>{{request.model}}</strong></p>
                    <p>Colour: <strong>{{request.colour}}</strong></p>
                </Col>
                <Col span="16" class="mapSection">
                    <div id="map" class="map"></div>
                    <br>
                    <Button type="primary" @click="completeRequest">Complete Request</Button>
                </Col>
                <Col span="4"></Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import L from 'leaflet'
import 'leaflet-routing-machine'
import { requestService, transactionService } from '@/_services'
import { router } from '../_helpers'
import Navigation from '@/components/Navigation'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default {
    props: ['requestId', 'memberUsernme'],
    data () {
        return {
            lat: null,
            lon: null,
            socket: null
        }
    },
    beforeRouteEnter (to, from, next) {
        //? Why use the request serive when we have the map actions method for getRequest?
        //* Because we cannot access the map actions methods before the page is instansiated (created) as they rely on there being a current state of the page,
        //* however we can access the request service methods since they do not rely upon this :)
        requestService.getById(to.params.requestId).then(request => {
            // If the request exists in the database, set this pages request state to the retrieved request and allow the route to this page
            if(request) {
                next(vm => vm.$store.state.requests.request = request);
            } else { // Else reject access and do not route that user to this page (keeps them on the page they were on before attempting to enter)
                next(false);
            }
        })
    },
    created () {
        this.socket = this.$parent.socket;
    },
    components: {
        'Navigation': Navigation
    },
    computed: {
        ...mapState({
            request: state => state.requests.request
        })
    },
    methods: {
        ...mapActions('requests', {
            getRequest: 'getById',
            getMembersRequest: 'getMembersRequest',
            updateRequestStatus: 'updateRequest'
        }),
        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.setPosition);
            }
        },
        setPosition(position) {
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;

            var map = L.map('map');
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            L.Routing.control({
                waypoints: [
                    L.latLng(this.lat, this.lon), // Starting destination
                    L.latLng(this.$store.state.requests.request.latitude, this.$store.state.requests.request.longitude) // Target destination (location of service request)
                ],
                routeWhileDragging: false
            }).addTo(map);
        },
        roundToTwoDecimal (num) {
            var num_sign = num >= 0 ? 1 : -1;
            num = (Math.round((num*Math.pow(10,2))+(num_sign*0.0001))/Math.pow(10,2)).toFixed(2);

            return num;
        },
        completeRequest() {
            let self = this;
            var transactionObj = {
                sender: self.memberUsernme,
                receiver: this.$store.state.account.user.username,
                amount: 50.00, // Default amount paid to professional if a subscription, overwritten if per-service
                paymentMethod: 'credit card',
                for: 'service',
                requestID: self.requestId
            }

            if (this.request.amount) { // Per-service request
                transactionObj.amount = this.request.amount * 0.88; // Professional gets 88% of the total cost

                var companiesTakeTransaction = Object.assign({}, transactionObj);
                companiesTakeTransaction.receiver = 'roadside-assistant';
                companiesTakeTransaction.sender = this.$store.state.account.user.username;
                companiesTakeTransaction.amount = this.request.amount * 0.12; // Company get 12% of the total cost as a fee
                
                companiesTakeTransaction.amount = this.roundToTwoDecimal(companiesTakeTransaction.amount);
                transactionObj.amount = this.roundToTwoDecimal(transactionObj.amount);

                transactionService.create(companiesTakeTransaction);
            } else { // Subscription request
                transactionObj.sender = 'roadside-assistant'; // Since the member is not paying per service, the company pays the professional a fee (no take from the company)
            }

            transactionService.create(transactionObj);
            const sendData = {
                status: 'completed',
                id: self.requestId
            }
            this.socket.emit('serviceCompleted', self.memberUsernme);
            
            this.updateRequestStatus(sendData);
            this.$Message.success(self.requestId + ' has been completed and payment made.');

            setTimeout(function () {
                router.push('requests');
            }, 3000);
        }
    },
    mounted () {
        this.getLocation();
    }
}
</script>
