<template>
    <div>
        <Modal v-model="view">
            <p slot="header" style="text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>Leave a review</span>
            </p>
            <p>Rate your experience...</p>
            <Rate allow-half v-model="rating" />
            <p>Leave a comment...</p>
            <Input v-model="comment" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="Enter something..." />
            <div slot="footer">
                <Button size="large" @click="cancel">Cancel</Button>
                <Button type="primary" size="large" @click="submitReview">Submit</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { userService } from '@/_services';
import { router } from '../_helpers';

export default {
    name: 'CreateReview',
    props: {
        userID: String
    },
    data () {
        return {
            rating: 0,
            comment: '',
            view: true
        }
    },
    methods: {
        cancel () {
            this.view = false;
            router.push('make-request'); // Sends the user back to the make a request page, could have sent to home aswell
        },
        submitReview () {
            const self = this;
            var review = {
                username: this.$store.state.account.user.username,
                rating: this.rating,
                comment: this.comment
            };

            userService.addReview(review, self.userID);
            this.$Message.success('Your review has been submitted!');
            this.view = false;
            router.push('make-request'); // Sends the user back to the make a request page, could have sent to home aswell
        }
    }
}
</script>
