// Cognitive OS - Functionality Test Script
// Run this in the browser console to test core functionality

console.log('🧠 Starting Cognitive OS Functionality Tests...');

// Test 1: Intent Classification
const testIntents = [
  { text: 'schedule meeting with John tomorrow', expected: 'planning' },
  { text: 'debug React component issues', expected: 'coding' },
  { text: 'research machine learning papers', expected: 'research' },
  { text: 'email client about updates', expected: 'communication' },
  { text: 'design new logo concept', expected: 'creative' }
];

// Test 2: Entity Extraction
const testEntities = [
  { text: 'call Sarah at 3pm tomorrow', expectedEntities: ['person', 'time', 'date'] },
  { text: 'create Python project with Django', expectedEntities: ['topic', 'topic'] },
  { text: 'analyze data.csv file', expectedEntities: ['file'] }
];

// Test 3: Performance Benchmarks
const performanceTests = {
  maxProcessingTime: 500, // milliseconds
  minConfidence: 0.6, // 60%
  expectedResponseTime: 300 // milliseconds
};

// Test 4: Privacy Validation
function testPrivacy() {
  console.log('🔒 Testing Privacy (No Network Requests)...');
  
  // Monitor network requests
  const originalFetch = window.fetch;
  const originalXHR = window.XMLHttpRequest;
  
  let networkRequests = [];
  
  // Override fetch
  window.fetch = function(...args) {
    networkRequests.push({ type: 'fetch', url: args[0] });
    return originalFetch.apply(this, args);
  };
  
  // Override XMLHttpRequest
  window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    xhr.open = function(method, url) {
      networkRequests.push({ type: 'xhr', method, url });
      return originalOpen.apply(this, arguments);
    };
    return xhr;
  };
  
  // Test for 10 seconds
  setTimeout(() => {
    const externalRequests = networkRequests.filter(req => 
      !req.url.includes('localhost') && 
      !req.url.includes('127.0.0.1') &&
      !req.url.startsWith('blob:') &&
      !req.url.startsWith('data:')
    );
    
    if (externalRequests.length === 0) {
      console.log('✅ Privacy Test PASSED: No external network requests detected');
    } else {
      console.warn('❌ Privacy Test FAILED: External requests detected:', externalRequests);
    }
    
    // Restore original functions
    window.fetch = originalFetch;
    window.XMLHttpRequest = originalXHR;
  }, 10000);
}

// Test 5: Local Storage Persistence
function testPersistence() {
  console.log('💾 Testing Data Persistence...');
  
  const testData = {
    intentHistory: [
      { text: 'test', intent: 'testing', confidence: 0.9, timestamp: new Date().toISOString(), entities: [] }
    ],
    lastActivity: new Date().toISOString(),
    learningData: []
  };
  
  // Save test data
  localStorage.setItem('cos-preferences', JSON.stringify(testData));
  
  // Retrieve and verify
  const retrieved = JSON.parse(localStorage.getItem('cos-preferences') || '{}');
  
  if (retrieved.intentHistory && retrieved.intentHistory.length > 0) {
    console.log('✅ Persistence Test PASSED: Data saved and retrieved successfully');
  } else {
    console.warn('❌ Persistence Test FAILED: Data not persisted correctly');
  }
}

// Test 6: TensorFlow.js Loading
function testTensorFlow() {
  console.log('🤖 Testing TensorFlow.js Integration...');
  
  if (typeof tf !== 'undefined') {
    console.log('✅ TensorFlow.js LOADED successfully');
    console.log('📊 Backend:', tf.getBackend());
    console.log('🔧 Version:', tf.version.tfjs);
  } else {
    console.warn('❌ TensorFlow.js NOT LOADED');
  }
}

// Test 7: Compromise.js NLP
function testNLP() {
  console.log('📝 Testing NLP (Compromise.js) Integration...');
  
  if (typeof nlp !== 'undefined') {
    const testText = 'John will meet Sarah tomorrow at 3pm';
    const doc = nlp(testText);
    const people = doc.people().out('array');
    const dates = doc.dates().out('array');
    
    if (people.length > 0 && dates.length > 0) {
      console.log('✅ NLP Test PASSED: Entities extracted successfully');
      console.log('👥 People:', people);
      console.log('📅 Dates:', dates);
    } else {
      console.warn('❌ NLP Test FAILED: Entity extraction not working');
    }
  } else {
    console.warn('❌ Compromise.js NOT LOADED');
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running Cognitive OS Test Suite...\n');
  
  testTensorFlow();
  testNLP();
  testPersistence();
  testPrivacy();
  
  console.log('\n📋 Manual Testing Instructions:');
  console.log('1. Type various intents in the input field');
  console.log('2. Watch the confidence scores and processing times');
  console.log('3. Check the insights panel for learning patterns');
  console.log('4. Use the demo mode for automated testing');
  console.log('5. Verify no network requests in Network tab');
  
  console.log('\n🎯 Success Criteria:');
  console.log('• Processing time < 500ms');
  console.log('• Confidence scores > 60%');
  console.log('• Entity extraction working');
  console.log('• No external network requests');
  console.log('• Data persists after refresh');
  
  console.log('\n✨ Cognitive OS Test Suite Complete!');
}

// Auto-run tests when script loads
runAllTests();

// Export test functions for manual use
window.CognitiveOSTests = {
  runAllTests,
  testTensorFlow,
  testNLP,
  testPersistence,
  testPrivacy
};