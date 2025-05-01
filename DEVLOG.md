# Development Log - Neo Cafe Coffee Delivery System

This document chronologically tracks the daily progress, decisions, challenges, and solutions throughout the development of the Neo Cafe Coffee Delivery System project.

## Week 1: Project Initialization

### 2025-01-15
**Participants**: Full Team  
**Activity**: Initial project kickoff meeting with client (Neo Cafe)

**Decisions Made**:
- Selected React as the frontend framework for the web application
  - **Justification**: Modern component architecture, vast ecosystem, and mobile optimization capabilities
  - **Alternatives Considered**: 
    - Dash (rejected due to limitations in custom UI and mobile responsiveness)
    - Vue.js (rejected due to team's stronger experience with React)

**Action Items**:
- Agnes: Create initial wireframes for the UI
- Emmanuel: Set up the project repository and basic structure
- Romerik: Research the Unitree Go 2 SDK and ROS2 integration options
- Jules: Develop initial test cases for NLP components

---

### 2025-01-16
**Participants**: Agnes, Emmanuel  
**Activity**: Frontend architecture planning

**Findings**:
- Agnes: Researched UI component libraries compatible with our design requirements
  - Decided on Tailwind CSS for styling
  - **Justification**: Utility-first approach allows for faster development and better consistency
  - **Alternatives Considered**: 
    - Material UI (too opinionated for our custom design needs)
    - Bootstrap (less flexible for custom designs)

- Emmanuel: Established project structure and state management approach
  - Decided on Context API with custom hooks for state management
  - **Justification**: Lightweight solution that avoids unnecessary complexity for our use case
  - **Alternatives Considered**:
    - Redux (too verbose and complex for our needs)
    - MobX (learning curve for team members unfamiliar with it)

**Action Items**:
- Create base component templates
- Implement basic page routing

---

### 2025-01-17
**Participants**: Romerik, Jules  
**Activity**: Backend architecture and NLP integration planning

**Findings**:
- Romerik: Analyzed the Unitree Go 2 API documentation
  - Identified limitations in the public SDK that will require custom workarounds
  - Documented required permissions for campus robot operation

- Jules: Tested several LLM providers for the natural language understanding component
  - Benchmarked OpenAI GPT-4, Claude, and LLaMA 3
  - GPT-4 showed 18% better performance in understanding coffee order terminology

**Decisions Made**:
- Selected OpenAI's GPT-4 for the NLP component
  - **Justification**: Superior accuracy in command understanding and parameter extraction
  - **Alternatives Considered**:
    - Claude (good but less accurate with coffee terminology)
    - LLaMA 3 (would require fine-tuning, increasing development time)

**Action Items**:
- Design LLM prompt structure for coffee ordering
- Create test dataset for NLP accuracy measurement

---

### 2025-01-18
**Participants**: Full Team  
**Activity**: End-to-end architecture review and prototype planning

**Decisions Made**:
- Decided to use a client-side prototype first before implementing full backend
  - **Justification**: Faster development cycle for testing concepts with users
  - **Alternatives Considered**:
    - Full-stack implementation from the start (rejected to avoid over-engineering before validation)

- Chose to implement simulated robot navigation for initial demo
  - **Justification**: Allows UI development to proceed without physical robot dependency
  - **Alternatives Considered**:
    - Waiting for physical robot setup (rejected due to timeline constraints)

**Challenges Identified**:
- Access to Unitree robot is limited to specific lab hours
- Integration between LLM and robot control will require careful abstraction

**Action Items**:
- Emmanuel: Implement authentication flow with localStorage
- Agnes: Create initial menu and order components
- Romerik: Develop simulated robot API endpoints
- Jules: Begin implementing LLM integration for order processing

---

## Week 2: Core Implementation

### 2025-01-21
**Participants**: Agnes  
**Activity**: UI component development

**Progress**:
- Completed initial versions of Navbar, MenuItem, and Cart components
- Implemented responsive design for mobile and desktop
- Added basic theme with Neo Cafe branding colors

**Challenges**:
- Tailwind configuration required customization for coffee-themed color palette
- Cart state management across components required custom event handling

**Next Steps**:
- Implement order history and tracking UI components

---

### 2025-01-22
**Participants**: Emmanuel  
**Activity**: Authentication and user management

**Progress**:
- Implemented client-side authentication with JWT simulation
- Created protected routes for authenticated users
- Added role-based access controls for admin features

**Decisions Made**:
- Store user preferences in localStorage for persistence
  - **Justification**: Simplifies implementation for prototype
  - **Alternatives Considered**:
    - Server-side storage (planned for production implementation)

**Next Steps**:
- Integrate authentication with order placement flow

---

### 2025-01-23
**Participants**: Romerik, Jules  
**Activity**: Robot simulation and LLM integration

**Progress**:
- Romerik: Created mock robot API endpoints for frontend testing
  - Implemented simulated delivery timing based on location
  - Added randomized path generation for map display

- Jules: Completed initial OpenAI integration
  - Set up basic prompt structure for order understanding
  - Implemented context window management for conversation history

**Challenges**:
- OpenAI API rate limits required implementing a caching strategy
- Robot path simulation needed realistic timing and obstacle avoidance

**Next Steps**:
- Enhance prompt engineering with few-shot examples
- Implement error handling for API failures

---

### 2025-01-24
**Participants**: Full Team  
**Activity**: Integration testing and prototype review

**Progress**:
- Connected UI components with backend services
- Tested end-to-end flow from order placement to delivery
- Identified gaps in error handling and edge cases

**Issues Discovered**:
- Order confirmation sometimes failed with complex custom orders
- Robot tracking occasionally lost connection in the UI

**Action Items**:
- Agnes: Improve error handling in cart and checkout components
- Emmanuel: Fix authentication token refresh issues
- Romerik: Enhance reliability of robot tracking simulation
- Jules: Add robust error recovery for LLM classification failures

---

## Week 3: Enhancement and Testing

### 2025-01-27
**Participants**: Agnes, Emmanuel  
**Activity**: UI polish and state management improvements

**Progress**:
- Agnes: Added animations for cart updates and order status changes
- Emmanuel: Implemented better state synchronization between components

**User Feedback**:
- Informal testing with 5 students indicated confusion about delivery location selection
- Redesigned location selection UI based on feedback

**Next Steps**:
- Implement comprehensive error messages
- Add loading states to improve perceived performance

---

### 2025-01-28
**Participants**: Romerik, Jules  
**Activity**: LLM performance optimization

**Progress**:
- Jules: Enhanced prompt with 25 example conversations
  - Improved entity extraction accuracy by 12%
  - Added better handling of ambiguous requests

- Romerik: Implemented WebSocket connection for real-time robot updates
  - Added simulated sensor failures to test resilience
  - Created recovery mechanisms for connection drops

**Technical Challenges**:
- Maintaining conversation context while keeping token usage efficient
- Ensuring real-time updates work across different network conditions

**Next Steps**:
- Implement more comprehensive testing scenarios
- Add telemetry and error logging

---

### 2025-01-29
**Participants**: Full Team  
**Activity**: Documentation and code review

**Progress**:
- Created initial versions of user and administrator guides
- Conducted comprehensive code review
- Added inline documentation to all major components

**Decisions Made**:
- Decided to add a dedicated section about the transition from Dash to React
  - **Justification**: Important architectural decision that should be documented
  - **Alternatives Considered**:
    - Only mention briefly in implementation details (rejected as it's a key learning)

**Action Items**:
- Complete user guide with screenshots
- Enhance API documentation
- Add troubleshooting section to admin guide

---

### 2025-01-30
**Participants**: Full Team  
**Activity**: Performance testing and optimization

**Progress**:
- Conducted load testing with simulated multiple concurrent orders
- Optimized component rendering performance
- Implemented lazy loading for non-critical components

**Performance Metrics**:
- Reduced initial load time by 42%
- Improved order processing time to under 2 seconds
- Achieved 95% accuracy in command understanding

**Next Steps**:
- Final polish before client presentation
- Prepare handover documentation

---

## Week 4: Finalization and Client Presentation

### 2025-02-03
**Participants**: Full Team  
**Activity**: Final integration testing

**Progress**:
- End-to-end testing of all core flows
- Fixed remaining UI issues and edge cases
- Verified all documentation is up-to-date

**Metrics Achieved**:
- 95% command accuracy
- 89% end-to-end order completion success
- 100% safety performance in robot navigation

**Preparation for Client Demo**:
- Created demonstration script
- Prepared test scenarios for live demonstration

---

### 2025-02-04
**Participants**: Full Team  
**Activity**: Client presentation and feedback

**Client Feedback**:
- Positive reception of the UI design and usability
- Suggestions for additional coffee customization options
- Interest in expanding to multiple robots in the future

**Next Steps**:
- Document future work recommendations
- Finalize handover materials

---

### 2025-02-05
**Participants**: Full Team  
**Activity**: Final report preparation

**Progress**:
- Compiled project metrics and results
- Documented lessons learned
- Outlined future development opportunities

**Final Deliverables Prepared**:
- Complete codebase with documentation
- User and administrator guides
- Technical implementation report
- Future development roadmap

---

## Key Decision Record

| Date | Decision | Justification | Alternatives Considered |
|------|----------|---------------|-------------------------|
| 2025-01-15 | Use React for frontend | Better component architecture and ecosystem | Dash, Vue.js |
| 2025-01-16 | Use Tailwind CSS | Faster development with utility classes | Material UI, Bootstrap |
| 2025-01-16 | Use Context API for state | Simpler than alternatives for our needs | Redux, MobX |
| 2025-01-17 | Use OpenAI GPT-4 | Superior accuracy with coffee terminology | Claude, LLaMA 3 |
| 2025-01-18 | Implement client-side prototype first | Faster iteration and validation | Full stack from start |
| 2025-01-22 | Use localStorage for user preferences | Simplifies prototype implementation | Server-side storage |
| 2025-01-29 | Document Dash to React transition | Important architectural decision | Brief mention only |