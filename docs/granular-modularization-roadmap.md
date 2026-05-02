Granular Modularization Roadmap: Providing a granular, function-by-function mapping for the surgical modularization.

✦ I have finalized the Granular Modularization Roadmap. This plan accounts for every single function in the original 2,400-line app.js,
ensuring 100% logic preservation while preparing the codebase for robust unit testing.

Detailed Plan Highlights:

1.  Function-to-Module Mapping: Every function has a designated new home. For example:
    - Pure Logic: generateRandomNumber and generateWord move to MathUtils.js.
    - Canvas Math: generateXEast and isCanvasLarge move to CoordinateUtils.js.
    - Rendering Loop: draw() and run() move to CoreEngine.js.
2.  Test-Driven Modularization: For every new module, I have planned a corresponding **tests** file. This ensures that every function,
    from the smallest math helper to the complex collision logic, will have dedicated unit tests.
3.  Visual Parity Guarantee: By porting the functions literally and avoiding modernization of the setInterval loop in this phase, we
    guarantee the "Digital Rain" will look and feel exactly as it did before.
4.  Zero-Risk Execution: We will extract functions one-by-one and verify each step with the test suite before proceeding to the next
    layer.

---

Informal Agreement:
Does this granular, function-by-function breakdown provide the level of detail and safety you were looking for? If you agree, I'll proceed
with creating the directory structure and starting the extraction process.
