/**
 * Tests vuex action
 *
 * @param {object} opts
 * @param {function} opts.action - action to dispatch
 * @param {*} opts.actionPayload - payload action will be dispatched with
 * @param {Array<object>} opts.expectedMutations - mutations expected to be committed inside action call
 * @param {Array<object>} opts.expectedActions - actions expected to be dispatched inside action call
 * @param {Array<*>} opts.expectedMutationPayloads - expected mutations payloads
 * @param {Array<*>} opts.expectedActionsPayloads - expected actions payloads
 * @param {object} opts.state
 * @param {object} opts.getters
 * @param {object} opts.rootGetters
 * @param done
 */
export const testAction = (opts, done) => {
  const action = opts.action
  const actionPayload = opts.actionPayload
  const expectedMutations = opts.expectedMutations || []
  const expectedActions = opts.expectedActions || []
  const expectedMutationPayloads = opts.expectedMutationPayloads || []
  const expectedActionsPayloads = opts.expectedActionsPayloads || []
  const state = opts.state
  const getters = opts.getters
  const rootGetters = opts.rootGetters

  try {
    let mutationsCount = 0
    let actionsCount = 0

    const commit = (type, payload) => {
      const expectedMutation = expectedMutations[mutationsCount]
      const expectedMutationPayload = expectedMutationPayloads[mutationsCount]

      try {
        expect(expectedMutation.type).to.equal(type)
        if (payload) {
          console.log('mutation payload:')
          console.log(payload)
          console.log('expected payload:')
          console.log(expectedMutationPayload)
          expect(payload).to.deep.equal(expectedMutationPayload)
        }
      } catch (error) {
        done(error)
      }

      mutationsCount++
      if (mutationsCount >= expectedMutations.length) {
        done()
      }
    }

    const dispatch = (type, payload) => {
      {
        const expectedAction = expectedActions[actionsCount]
        const expectedActionPayload = expectedActionsPayloads[actionsCount]

        try {
          expect(expectedAction.type).to.equal(type)
          if (payload) {
            console.log('action payload:')
            console.log(payload)
            console.log('expected payload:')
            console.log(expectedActionPayload)
            expect(payload).to.deep.equal(expectedActionPayload)
          }
        } catch (error) {
          done(error)
        }

        actionsCount++
        if (actionsCount >= expectedActions.length) {
          done()
        }
      }
    }

    action({ commit, dispatch, state, getters, rootGetters }, actionPayload)

    if (expectedMutations.length === 0) {
      expect(mutationsCount).to.equal(0)
      done()
    }

    if (expectedActions.length === 0) {
      expect(actionsCount).to.equal(0)
      done()
    }

  } catch (e) {
    done(e)
  }
}
