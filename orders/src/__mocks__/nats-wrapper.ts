export const natsWrapper = {
    client: {
        /**
         * jest.fn().mockImplementation is a Jest function that allows us to mock the implementation of a function,
         * so we can assert that it was called with the correct arguments.
         */
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
            callback();
        })
        /**
         * If we use the below code then we can't assert that the publish function was called with the correct arguments.
         */
        // publish: (subject: string, data: string, callback: () => void) => {
        //     callback();
        // }
    }
};