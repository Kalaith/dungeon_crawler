import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    // Add any custom options here if needed
}

const customRender = (
    ui: ReactElement,
    options: CustomRenderOptions = {}
) => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );

    return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
